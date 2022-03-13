const express = require("express")
const Wallet = require("../Model/Account")

const router = express.Router()

router.get("/balance", async(req, res) => {
    try {
    const formatToCurrency = (amount) => {
    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
    }
    const { accountnumber } = req.body
    const wallet =  await Wallet.find({ AccountNumber: accountnumber }).select('AccountBalance')
    res.json({ Message: `Your Current Balance is ${formatToCurrency(wallet[0].AccountBalance)}` })  
        
    }
    catch (err) {
        console.log(err)
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
        res.json({message : err})
    }
    
})

router.patch("/update", async(req, res) => {
    try {

    const { accountNumber, name, email } = req.body
    const filter = { AccountNumber: accountNumber };
    const updateItem = {
        Name: name,
        EmailAddress:email
    };

    await Wallet.findOneAndUpdate(filter, updateItem, { new: true })
        res.json({ message: `Account Updated` })
    }
    catch(err) {
        res.json({message:err})
    }
})


router.patch("/disable", async (req, res) => {
    try {
    const { accountNumber } = req.body

    const filter = { AccountNumber: accountNumber };
    const updateItem = {AccountStatus: "Disabled",  };

    const disabled = await Wallet.findOneAndUpdate(filter, updateItem, { new: true })
    res.json({ message: `Account ${disabled.AccountStatus}` })
    
    }
    
    catch(err)  {
        res.json({message:err})
    }
})

router.patch("/activate", async(req, res) => {
    try {
    const { accountNumber } = req.body

    const filter = { AccountNumber: accountNumber };
    const updateItem = {AccountStatus: "Active"};

   const activated =  await Wallet.findOneAndUpdate(filter, updateItem ,{new: true})
    res.json({ message: `Account ${activated.AccountStatus}` })
    }
    catch(err) {
        res.json({message:err})
    }
})


module.exports = router