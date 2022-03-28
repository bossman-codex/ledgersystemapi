const express = require('express');
const Wallet = require('../db/Model/Account');
const Transfer = require('../db/Model/Transaction');
const mongoose = require('mongoose');
const router = express.Router();
const randomnumber = require('../randomnumber');

router.get('/all', async (req, res) => {
  try {
    const { accountnumber } = req.body;
    const query = {
      $or: [
        { AccountNumberSender: { $regex: accountnumber } },
        { AccountNumberReceiver: { $regex: accountnumber } }
      ]
    };
    const allItem = await Transfer.find(query);
    res.status(200).json(allItem);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/deposit', async (req, res) => {
  try {
    const { accountnumber, name, amount } = req.body;
    const wallet = await Wallet.findOne({ AccountNumber: accountnumber });
    const walletItem = wallet[0];
    const money = parseInt(amount);

    if (
      walletItem.AccountNumber == accountnumber &&
      walletItem.AccountStatus == 'Active'
    ) {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        const transact = new Transfer({
          TransactionId: randomnumber(10),
          AccountNumberSender: accountnumber,
          AccountNumberReceiver: accountnumber,
          Name: name,
          Amount: money,
          AccountBalance: walletItem.AccountBalance + money,
          Description: 'Credit'
        });
        const transaction = await transact.save({ session });
        const filter = { AccountNumber: accountnumber };
        const updateItem = { AccountBalance: transaction.AccountBalance };
        const result = await Wallet.findOneAndUpdate(filter, updateItem, {
          new: true,
          session
        });
        res.status(200).json({
          message: 'Deposit Successful',
          transaction: result
        });

        await session.commitTransaction();
      });
      await session.endSession();
    } else {
      res.status(400).json({
        message: 'Account Deactivated'
      });
    }
  } catch (err) {
    res.status(400).json('error from beginning');
  }
});

router.post('/withdrawal', async (req, res) => {
  const { accountnumber, name, amount } = req.body;
  try {
    const wallet = await Wallet.findOne({ AccountNumber: accountnumber });
    const walletItem = wallet[0];
    const money = parseInt(amount);
    if (money <= walletItem.AccountBalance) {
      res.status(400).send('Insuffient Fund');
    }
    if (
      walletItem.AccountNumber == accountnumber &&
      walletItem.AccountStatus == 'Active'
    ) {
      try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
          const transaction = new Transfer({
            TransactionId: randomnumber(10),
            AccountNumberSender: accountnumber,
            AccountNumberReceiver: accountnumber,
            Name: name,
            Amount: money,
            AccountBalance: walletItem.AccountBalance - money,
            Description: 'Debit'
          });
          const transact = transaction.save({ session });
          const filter = { AccountNumber: accountnumber };
          const updateItem = { AccountBalance: transact.AccountBalance };
          const withdraw = await Wallet.findOneAndUpdate(filter, updateItem, {
            new: true,
            session
          });
          res.status(200).json({
            message: 'Withdrawal Successful',
            transaction: withdraw
          });
          await session.commitTransaction();
        });
        await session.endSession();
      } catch (err) {
        res.status(400).json(err);
      }
    } else {
      res.status(400).json({ message: 'Account Deactivated' });
    }
  } catch (err) {
    res.status(400).json({ message: 'invalid AccountNumber' });
  }
});

router.post('/transfer', async (req, res) => {
  try {
    const { accountnumber, receiveraccountnumber, name, amount } = req.body;

    try {
      const session = await mongoose.startSession();
      session.withTransaction(async () => {
        const wallet = await Wallet.find({
          AccountNumber: { $in: [accountnumber, receiveraccountnumber] }
        });
        if (wallet.length === 2) {
          const walletItem = wallet[0];
          const receiverWallet = wallet[1];

          const money = parseInt(amount);

          if (money <= walletItem.AccountBalance) {
            res.status(400).send('Insuffient Fund');
          }
          if (
            walletItem.AccountNumber == accountnumber &&
            walletItem.AccountStatus == 'Active'
          ) {
            if (
              receiverWallet.AccountNumber == accountnumber &&
              receiverWallet.AccountStatus == 'Active'
            ) {
              const transaction = new Transfer({
                TransactionId: randomnumber(10),
                AccountNumberSender: accountnumber,
                AccountNumberReceiver: receiveraccountnumber,
                Name: name,
                Amount: money,
                AccountBalance: walletItem.AccountBalance - money,
                Description: 'Debit'
              });
              const transact = transaction.save({ session });
              const filter = { AccountNumber: accountnumber };
              const updateItem = { AccountBalance: transact.AccountBalance };
              await Wallet.findOneAndUpdate(filter, updateItem, {
                new: true,
                session
              });
              const filterCredit = { AccountNumber: receiveraccountnumber };
              const updateItemCredit = {
                AccountBalance: receiverWallet.AccountBalance + money
              };
              await Wallet.findOneAndUpdate(filterCredit, updateItemCredit, {
                new: true,
                session
              });
              res.status(200).json({
                message: 'Transfer Successful',
                transaction: transact
              });
              await session.commitTransaction();
            } else {
              res.status(400).json({
                message: "Incorrect Receiver's Account Number or Deactivated"
              });
            }
          } else {
            res.status(400).json({
              message: 'Your Account Number is Incorrect or Deactivated'
            });
          }
        } else {
          res.status(400).json({ message: 'invalid AccountNumber' });
        }
      });
      await session.endSession();
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    res.status(400).json({
      message: 'Transfer Unsuccessful',
      transaction: err
    });
  }
});

router.post('/refund', async (req, res) => {
  try {
    const { accountnumber, transactionId } = req.body;

    const trxid = await Transfer.find({
      TransactionId: { $in: [transactionId] }
    });
    const AcctIsValid = trxid[0].AccountNumberSender == accountnumber;
    try {
      if (AcctIsValid) {
        const wallet = await Wallet.find({
          AccountNumber: {
            $in: [trxid[0].AccountNumberSender, trxid[0].AccountNumberReceiver]
          }
        });
        const walletItem = wallet[0];
        const receiverWallet = wallet[1];
        console.log(walletItem, receiverWallet);
        if (wallet == receiverWallet) {
          return res.status(400).json({ message: 'Unable to refund' });
        }
        if (
          walletItem.AccountNumber == accountnumber &&
          walletItem.AccountStatus == 'Active'
        ) {
          try {
            const session = await mongoose.startSession();
            await session.withTransaction(async () => {
              const filterTranscation = { TransactionId: transactionId };
              const updateItemTranscation = { Description: 'Refunded' };

              const refundTransaction = await Transfer.findOneAndUpdate(
                filterTranscation,
                updateItemTranscation,
                { new: true }
              );

              const filterAccountNumber = { AccountNumber: accountnumber };
              const updateItemAccountBalance = {
                AccountBalance:
                  refundTransaction.AccountBalance + transaction.Amount
              };

              const transaction = await Wallet.findOneAndUpdate(
                filterAccountNumber,
                updateItemAccountBalance,
                { new: true }
              );

              const filterReceiverAccount = {
                AccountNumber: transaction.AccountNumberReceiver
              };
              const updateItemReceiverAccount = {
                AccountBalance:
                  receiverWallet.AccountBalance - transaction.Amount
              };
              await Wallet.findOneAndUpdate(
                filterReceiverAccount,
                updateItemReceiverAccount,
                { new: true }
              );
              res.status(200).json({
                Message: 'Transfer Refunded',
                transction: transaction,
                account: refundTransaction
              });
            });
          } catch (err) {
            res.status(400).json('Refund failed');
          }
        } else {
          res.status(400).json({ message: 'Account Deactivated' });
        }
      } else {
        res.status(400).json({ message: 'Account Number is not valid' });
      }
    } catch {
      res.status(400).json({ message: 'Account Not Found' });
    }
  } catch {
    res.status(400).json({ message: 'Invalid TransactionID' });
  }
});

module.exports = router;
