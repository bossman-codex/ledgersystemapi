const express = require("express")
const Wallet = require("../db/Model/Account")
const router = express.Router()

router.get("/balance", async(req, res) => {
    try {
    const formatToCurrency = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
    }
    const { accountNumber } = req.body
    if (!accountNumber) {
        return res.json({message : 'AccountNumber MISSING!!' })
    }
        const wallet = await Wallet.find({ AccountNumber: accountNumber }).select('AccountBalance')
        res.json({ Message: `Your Current Balance is ${formatToCurrency(wallet[0].AccountBalance)}` })  

        
    }
    catch (err) {
        res.json({message : "Invalid Account Number"})
    }
})

router.post("/create", async (req, res) => {
    try {
        function makeAccount(length) {
            var result = '';
            var characters = '0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        const { name, email, phone } = req.body
        if (!name || !email) {
            return res.json({message : 'Email or Name is MISSING!!' })
        }
        
        const wallet = new Wallet({
            AccountNumber: makeAccount(6),
            Name: name,
            EmailAddress: email,
            phoneNumber: phone,
            AccountBalance: 0
        })
        const Walletitem = await wallet.save()
        res.send(Walletitem)
    }      
    catch (err) {
        res.json({message : "Email Already In Use , TRY ANOTHER EMAIL ADDRESS"})
    }
    
})

router.patch("/update", async (req, res) => {
    
    try {

    const { accountNumber, name, email } = req.body
      if (!accountNumber) {
            return res.json({message : 'AccountNumber MISSING!!' })
        }
    const filter = { AccountNumber: accountNumber };
    const updateItem = {
        Name: name,
        EmailAddress:email
    };

        const response = await Wallet.findOneAndUpdate(filter, updateItem, { new: true })
         if (response === null) {
            res.json({message:"Account not found"})
         } else {
              res.json({ message: `Account Updated` })
        }
    }
    catch(err) {
        res.json({message:"Account not found"})
    }
})


router.patch("/disable", async (req, res) => {
    try {
    const { accountNumber } = req.body
 if (!accountNumber) {
            return res.json({message : 'AccountNumber MISSING!!' })
        }
    const filter = { AccountNumber: accountNumber };
    const updateItem = {AccountStatus: "Disabled",  };

        const response = await Wallet.findOneAndUpdate(filter, updateItem, { new: true })
         if (response === null) {
            res.json({message:"Account not found"})
         } else {
              res.json({ message: `Account Disabled` })
        }
   
    
    }
    
    catch(err)  {
        res.json({message:"Account not found"})
    }
})

router.patch("/activate", async (req, res) => {
    try {
    const { accountNumber } = req.body
 if (!accountNumber) {
            return res.json({message : 'AccountNumber Is MISSING!!' })
        }
    const filter = { AccountNumber: accountNumber };
    const updateItem = {AccountStatus: "Active",  };

        const response = await Wallet.findOneAndUpdate(filter, updateItem, { new: true })
        if (response === null) {
            res.json({message:"Account not found"})
        } else {
             res.json({ message: "Account Activated" })
        }
   
    
        }
    
    catch(err)  {
        res.json({message:"Account not found"})
    }
})


module.exports = router