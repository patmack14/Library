const validator = require('express-validator');
var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_genres){
    if(err){return next(err); }
    res.render('genre_list', {title: 'Genre List', list_genres: list_genres});
});
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: function(callback){
            Genre.findById(req.params.id)
            .exec(callback)
        },

        genre_books: function(callback){
            Book.find({ 'genre': req.params.id})
            .exec(callback)
        },
    },  function(err, results)  {
        if(err) { return next(err); }
        if (results.genre==null) { //if there are no search results
            var err  = new Error ('There were no Genres found that match your query')
            err.status = 404;
            return next(err);
    }
    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form',{title: 'Create a Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    validator.body('name', 'Genre name required').trim().isLength({min:1}),//Makes sure the fields are not empty

    validator.sanitizeBody('name').escape(),//Sanitizes the name field

    (req,res,next)=>{//Continuing on after length validation and Sanitization.
        const errors = validator.validationResult(req);  //extracting the errors 
    
        var genre = new Genre(//Creates the new object with the formatted data
            {name: req.body.name}
        );

            if(!errors.isEmpty()){  //If the errors field is NOT empty(there are errors) resend the form
                res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    }
    else {//The data is tots valid now Checking to make sure there is not an existing Genre already
        Genre.findOne({ 'name':req.body.name})
        .exec ( function(err, found_genre) {
            if (err) { return next(err); }
 
            if (found_genre) {
              // Genre already exists :(  Let the user know
              res.redirect(found_genre.url);
            }
            else {
 
              genre.save(function (err) {
                if (err) { return next(err); }
                // Genre successfully  saved. 
                res.redirect(genre.url);
              });
 
            }
 
          });
     }
   }
 ];

    


// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};