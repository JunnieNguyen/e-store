// Dependencies
var express = require('express');
var router = express.Router();
var q = require('q');
var auth = require('../config/auth');
var constant = require('../config/constant');
var dbContext = require('../config/dbContext');
var errorHelper = require('../config/errorHelper');
var accountService = require('../services/accountService');

// Router
router.get('/items', function (req, res, next) {
	dbContext.getConnection().then(function (result) {
		ctx = result;
		return accountService.getAccounts(ctx);
	}).then(function (accounts) {
		res.status(200).json(accounts);
	}).catch(function (error) {
		next(error);
	}).done(function () {
		ctx.release();
	});
});

router.get('/items/:id', function (req, res, next) {
    var accountId = req.params.id;

	var ctx = {};        
	dbContext.getConnection().then(function (result) {
		ctx = result;
		return accountService.getAccountById(ctx, accountId);
	}).then(function (accounts) {
		if (accounts.length == 0) {
            res.status(404).json(errorHelper.Error_Existed_AccountId);
		} else {
			res.status(200).json(accounts[0]);
		}
	}).catch(function (error) {
        next(error);
	}).done(function () {
		ctx.release();		
	});
});

router.post('/create', function (req, res, next) {
	// validate data at server side
	
});

router.put('/update', function (req, res, next) {
    // validate data at server side
    var brand = {
        BrandId: req.body.BrandId,
        Name: req.body.Name,
        Description: req.body.Description
    };
    
	var ctx = {};
	dbContext.getConnection().then(function (result) {
		ctx = result;
		return ctx.beginTransaction();
	}).then(function () {
		return accountService.updateBrand(ctx, brand);
	}).then(function () {
		return ctx.commitTransaction();
	}).then(function () {
        res.status(200).json({ code: 'UPDATE_BRAND_SUCCESS', message: "Update Brand is success." });
	}).catch(function (error) {
		ctx.rollbackTransaction();        
        next(error);
	}).done(function () {
		ctx.release();		
	});
});

router.delete('/delete', function (req, res, next) {
	// validate data at server side
	
});

// return Router
module.exports = router;
