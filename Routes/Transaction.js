const express = require("express")
const Wallet = require("../db/Model/Account")
const Transfer = require("../db/Model/Transaction")


const router = express.Router()

router.get("/all", async (req, res) => {
    try {
    const { accountnumber } = req.body
    const query = {$or:[{AccountNumberSender:{$regex: accountnumber}},{AccountNumberReceiver:{$regex: accountnumber}}]}
    const allItem = await Transfer.find(query)
       res.json(allItem)
    }
    catch (err) {
        res.send(err)
    }  
})

router.post("/deposit", async(req, res) => {
    function makeTransactionId(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    const { accountnumber, name, amount } = req.body
    Wallet.find({ AccountNumber: accountnumber })
        .then((wallet) => {
            const walletItem = wallet[0]
            const money = parseInt(amount)
            if (walletItem.AccountNumber == accountnumber && walletItem.AccountStatus == "Active") {
                const transaction = new Transfer({
                TransactionId: makeTransactionId(10),   
                AccountNumberSender: accountnumber,
                AccountNumberReceiver: accountnumber,
                Name: name,
                Amount:money,
                AccountBalance: walletItem.AccountBalance + money,
                Description : "Credit"
                })    
                transaction.save()
                .then(transaction => {
                    const filter = { AccountNumber: accountnumber };
                    const updateItem = {
                    AccountBalance: transaction.AccountBalance
                    };
                    Wallet.findOneAndUpdate(filter, updateItem ,{
                    new: true
                    })
                        .then(()=>{
                        res.json("Deposit Successful")
                        }).catch(err => {
                        res.json(err)
                    })
                    })
                    .catch(err => {
                    res.json(err)
                })
            }
            else {
                res.json({
                     message: "Account Deactivated",
                }) 
            }
        }) 
        .catch ((err) => {
             res.json({message:"invalid AccountNumber"})       
        })
})

router.post("/withdrawal", (req, res) => {
    function makeTransactionId(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    const { accountnumber, name, amount } = req.body
    Wallet.find({ AccountNumber: accountnumber })
        .then((wallet) => {
            const walletItem = wallet[0]
            const money = parseInt(amount)
            if (money <= walletItem.AccountBalance) {


                if (walletItem.AccountNumber == accountnumber && walletItem.AccountStatus == "Active") {
                    const transaction = new Transfer({
                        TransactionId: makeTransactionId(10),
                        AccountNumberSender: accountnumber,
                        AccountNumberReceiver: accountnumber,
                        Name: name,
                        Amount: money,
                        AccountBalance: walletItem.AccountBalance - money  ,
                        Description: "Debit"
                    })
                    transaction.save()
                        .then(transaction => {
                            const filter = { AccountNumber: accountnumber };
                            const updateItem = {
                                AccountBalance: transaction.AccountBalance
                            };
                            Wallet.findOneAndUpdate(filter, updateItem, {
                                new: true
                            })
                                .then(() => {
                                    res.json("Withdrawal Successful")
                                }).catch(err => {
                                    res.json(err)
                                })
                        })
                        .catch(err => {
                            res.json(err)
                        })
                }
                else {
                    res.json({
                        message: "Account Deactivated", 
                    })
                }



            } else {
                    res.send("Insuffient Fund")
                }     
        }) 
        .catch ((err) => {
             res.json({message:"invalid AccountNumber"})       
        })
})

router.post("/transfer", (req, res) => {
    function makeTransactionId(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    const { accountnumber, receiveraccountnumber, name, amount } = req.body
   
    Wallet.find({ "AccountNumber" : { $in : [ accountnumber, receiveraccountnumber ] } })
        .then((wallet) => {
            console.log(wallet)
            if (wallet.length === 2) {
                 const walletItem = wallet[0]
         const receiverWallet = wallet[1]
         const money = parseInt(amount)
            if (money <= walletItem.AccountBalance) {
                 

                if (walletItem.AccountNumber == accountnumber && walletItem.AccountStatus == "Active") {
                    const transaction = new Transfer({
                        TransactionId: makeTransactionId(10),
                        AccountNumberSender: accountnumber,
                        AccountNumberReceiver: receiveraccountnumber,
                        Name: name,
                        Amount: money,
                        AccountBalance: walletItem.AccountBalance - money  ,
                        Description: "Debit"
                    })
                    transaction.save()
                        .then(transaction => {
                            const filter = { AccountNumber: accountnumber };
                            const updateItem = {
                                AccountBalance: transaction.AccountBalance
                            };
                            Wallet.findOneAndUpdate(filter, updateItem, {
                                new: true
                            })
                                .then(() => {
                                    const filter = { AccountNumber: receiveraccountnumber };
                                    const updateItem = {
                                    AccountBalance: receiverWallet.AccountBalance + money
                                    };
                                    Wallet.findOneAndUpdate(filter, updateItem, {
                                    new: true
                                    })
                                    .then(() => {
                                         res.json(transaction)
                                        }).catch(err => {
                                         res.json(err)
                                        })
                                }).catch(err => {
                                    res.json(err)
                                })
                        })
                        .catch(err => {
                            res.json(err)
                        })
                }
                else {
                    res.json({
                        message: "Account Deactivated",
                    })
                }



            } else {
                    res.send("Insuffient Fund")
                } 
            }
            else {
                res.json({message : "invalid AccountNumber"})
            }
         
            
        }) 
        .catch ((err) => {
             res.json({message:"invalid AccountNumber"})       
        })
})

router.post("/refund", (req, res) => { 
    const { accountnumber, transactionId} = req.body

    Transfer.find({ "TransactionId" : { $in : [ transactionId ] } })
        .then((trxid) => {
         const AcctIsValid  = trxid[0].AccountNumberSender == accountnumber 
            if (AcctIsValid) {
            Wallet.find({ "AccountNumber" : { $in : [ trxid[0].AccountNumberSender, trxid[0].AccountNumberReceiver ] } })
           .then((wallet) => {
                const walletItem = wallet[0]
                const receiverWallet = wallet[1]
                if (walletItem.AccountNumber == accountnumber && walletItem.AccountStatus == "Active") {
                          const filter = { TransactionId: transactionId};
                          const updateItem = {
                                
                            Description: "Refunded"
                            };
                            Transfer.findOneAndUpdate(filter, updateItem, {
                                new: true
                            })
                           .then(transaction => {
                            const filter = { AccountNumber: accountnumber };
                            const updateItem = {
                                AccountBalance: transaction.AccountBalance + transaction.Amount
                            };
                            Wallet.findOneAndUpdate(filter, updateItem, {
                                new: true
                            })
                                .then(() => {
                                  
                                    const filter = { AccountNumber: transaction.AccountNumberReceiver };
                                    const updateItem = {
                                    AccountBalance: receiverWallet.AccountBalance - transaction.Amount
                                    };
                                    Wallet.findOneAndUpdate(filter, updateItem, {
                                    new: true
                                    })
                                    .then(() => {res.json({Message : 'Transfer Refunded' })})
                                })
                        })
                        .catch(() => {
                            res.json("Refund failed")
                        })
                }
                else {
                    res.json({
                        message: "Account Deactivated",
                    })
                }
        }) 
        .catch (() => {
             res.json({message:"Account Not Found"})       
        })
                 } 
        else {
            res.json({message : "Account Number is not valid"})  
        }
        }) 
        .catch (() => {
             res.json({message:"Invalid TransactionID"})       
        })
})


module.exports = router