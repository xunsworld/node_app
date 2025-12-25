// login & register
const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const passport = require('passport');
const profileController = require('../../controllers/profileController');

// @route   POST api/profiles/add
// @desc    Add or Edit User Profile
// @access  Private
router.post("/insertOne", passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {};
    for (const key in req.body) {
        profileFields[key] = req.body[key];
    }
    profileController.addProfile(profileFields, res);
})

router.post("/insertMany", passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body)
    profileController.addProfile(req.body, res);
})



// @route   GET api/profiles/
// @desc    Get All Profiles
// @access  Private
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.find().then(profiles => {
        if (!profiles) {
            return res.status(404).json({ msg: "No profiles found" });
        }
        res.json(profiles);
    }).catch(err => {
        res.status(404).json(err);
    });
})



// @route   GET api/profiles/:id
// @desc    Get Profile by ID
// @access  Private
router.get("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    profileController.getProfiles(req.params, res);
})

router.post("/search", passport.authenticate('jwt', { session: false }), (req, res) => {
    profileController.getProfiles(req.body, res);
})


// @route   POST api/profiles/edit/:id
// @desc    Edit User Profile
// @access  Private
router.post("/edit/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {};
    for (const key in req.body) {
        profileFields[key] = req.body[key];
    }
    profileController.updateOneProfile(req.params.id, profileFields, res);
    // Profile.findOneAndUpdate({ _id: req.params.id }, { $set: profileFields }, { new: true })
    // .then((profile) => {
    //     res.json(profile);
    // });
})


//  delete profile
router.get("/delete/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    profileController.deleteProfile([req.params.id], res);
})

router.post("/delete", passport.authenticate('jwt', { session: false }), (req, res) => {
    profileController.deleteProfile([...req.body.ids], res);
})

module.exports = router;