var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var models = require('../models');
var Page = models.Page;
var User = models.User;
var expect = require('chai').expect;

before(function(done) {
  User.sync({force:true})
      .then(function () {
          return Page.sync({force:true});
      })
      .then(function () {
          done();
      });
});

describe('Testing Page Models', function() {

  describe('Virtual Tests', function () {

    var page;
    before(function () {
      page = Page.build({
        title: 'foo',
        content: 'bar',
        tags: ['foo', 'bar']
      });
      page.save();
    });

    it('returns the url_name prepended with \'wiki\'', function() {
      expect(page.route).to.equal("/wiki/" + page.urlTitle);
    });

    it('gets pages with the search tag', function(done) {
      Page.findByTag('bar')
          .then(function(pages) {
              expect(pages).to.have.lengthOf(1);
              done();
          })
          .catch(done);
        });

    it('does not get pages without the search tag', function(done) {
      Page.findByTag('falafel')
          .then(function(pages) {
              expect(pages).to.have.lengthOf(0);
              done();
          })
          .catch(done);
        });
  });

  describe('Instance Methods', function() {

    before(function(done) {
         Page.bulkCreate([{
                title: 'base',
                content: 'this is just a test',
                tags: ['foo', 'bar']
            }, {
                title: 'shared page',
                content: 'bar',
                tags: ['falafel', 'bar']
            }, {
                title: 'no shared tags page',
                content: 'holler',
                tags: ['rap', 'superstar']
            }], {
                validate: true,
                individualHooks: true
            });
            done();
    });

    it('finds similar files based on shared tags', function(done) {
        //use findSimilar on a page example
        Page.findByTag('bar')
            .then(function(pages) {
              expect(pages).to.have.lengthOf(3);
              done();
            })
            .catch(done);

    })
});



})
