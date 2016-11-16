/* global angular */

angular.module('mariposa-training')
.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/assets/templates/main/home.html',
      controller: 'HomeCtrl',
      resolve:{
        "check":function($state, Session){   
            if(Session.userId != null){
                $state.go("accountNew");
            }
          }
      }
    })
    .state('about', {
      url: '/AboutUs',
      templateUrl: 'assets/templates/footer/about.html',
      controller: 'HomeCtrl'
    })
    .state('policy', {
      url: '/PrivacyPolicy',
      templateUrl: 'assets/templates/footer/policy.html',
      controller: 'HomeCtrl'
    })
    .state('faq', {
      url: '/FAQ',
      templateUrl: 'assets/templates/footer/faq.html',
      controller: 'HomeCtrl'
    })
    .state('terms', {
      url: '/Terms&Conditions',
      templateUrl: 'assets/templates/footer/terms.html',
      controller: 'HomeCtrl'
    })
    .state('contact', {
      url: '/ContactUs',
      templateUrl: 'assets/templates/footer/contact.html',
      controller: 'HomeCtrl'
    })
    .state('classes', {
      url: '/Catalog/Classes',
      templateUrl: 'assets/templates/main/classes.html',
      controller: 'ClassesCtrl'
    })
    .state('certifications', {
      url: '/Catalog/Certifications',
      templateUrl: 'assets/templates/main/certifications.html',
      controller: 'CertificationsCtrl'
    })
    .state('bundles', {
      url: '/Catalog/Bundles',
      templateUrl: 'assets/templates/main/bundles.html',
      controller: 'BundlesCtrl'
    })
    .state('classDescription', {
      url: '/Class/LearnMore/:Soid',
      templateUrl: 'assets/templates/main/classDescription.html',
      controller: 'ClassDescriptionCtrl'
    })
    .state('longtermIndividual', {
      url: '/LongTermCare/Individual',
      templateUrl: 'assets/templates/main/longtermIndividual.html',
      controller: 'LongtermCtrl'
    })
    .state('longtermFacilities', {
      url: '/LongTermCare/Facilities',
      templateUrl: 'assets/templates/main/longtermFacilities.html',
      controller: 'LongtermCtrl'
    })
    .state('homecareFacilities', {
      url: '/HomeHealthCare/Facilities',
      templateUrl: 'assets/templates/main/homecareFacilities.html',
      controller: 'HomecareCtrl'
    })
    .state('homecareIndividual', {
      url: '/HomeHealthCare/Individual',
      templateUrl: 'assets/templates/main/homecareIndividual.html',
      controller: 'HomecareCtrl'
    })
    .state('blog', {
      url: '/Blog',
      templateUrl: 'assets/templates/main/blog.html',
      controller: 'BlogCtrl'
    })
    .state('cart', {
      url: '/Cart',
      templateUrl: 'assets/templates/cart/checkout.html',
      controller: 'CheckoutCtrl',
      resolve:{
        "check":function($location, Cart){   
            if(Cart.getTotalCount() == 0){
                $location.path('/');
            }
        }
    }
    })
    .state('paymentInfo', {
      url: '/Cart/CardInformation',
      templateUrl: 'assets/templates/cart/paymentInfo.html',
      controller: 'PaymentPrepCtrl',
      resolve:{
        "check":function($location, Transaction, Cart){   
            if(Cart.getTotalCount() == 0){
              $location.path('/');
            }else if(Transaction.prepareTransaction == false){
               $location.path('/Cart');
            }
        }
    }
    })
    .state('accountIncomplete', {
      url: '/MyAccount/Incomplete',
      templateUrl: 'assets/templates/account/accountIncomplete.html',
      controller: 'AccountCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('accountCompleted', {
      url: '/MyAccount/Completed',
      templateUrl: 'assets/templates/account/accountCompleted.html',
      controller: 'AccountCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('accountNew', {
      url: '/MyAccount/New',
      templateUrl: 'assets/templates/account/accountNew.html',
      controller: 'AccountCtrl',
      resolve:{
        "check":function($state, Session){   
            if(Session.userId == null)
                $state.go("home");
        }
      }
    })
    .state('accountArchived', {
      url: '/MyAccount/Archived',
      templateUrl: 'assets/templates/account/accountArchived.html',
      controller: 'AccountCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('accountScheduled', {
      url: '/MyAccount/Scheduled',
      templateUrl: 'assets/templates/account/accountScheduled.html',
      controller: 'AccountCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('accountCertifications', {
      url: '/MyAccount/Certifications',
      templateUrl: 'assets/templates/account/accountCertifications.html',
      controller: 'AccountCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('accountDiploma', {
      url: '/MyAccount/Diploma/:lectureSoid',
      templateUrl: 'assets/templates/account/diploma.html',
      controller: 'DiplomaCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('testResult', {
      url: '/Class/TestResult/:lectureSoid',
      templateUrl: 'assets/templates/account/diploma.html',
      controller: 'DiplomaCtrl',
      resolve:{
        check:function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('personalInfo', {
      url: '/MyAccount/PersonalInformation',
      templateUrl: 'assets/templates/account/personalInfo.html',
      controller: 'PersonalInfoCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('invoices', {
      url: '/MyAccount/Invoices',
      templateUrl: 'assets/templates/account/invoices.html',
      controller: 'InvoicesCtrl',
      resolve:{
        "check":function($location, Session){   
            if(Session.userId == null)
                $location.path('/');
        }
      }
    })
    .state('passwordRecovery', {
      url: '/Credentials/PasswordRecovery',
      templateUrl: 'assets/templates/main/passwordRecovery.html',
      controller: 'PasswordRecoveryCtrl'
    })
    .state('students', {
      url: '/Management/Students',
      templateUrl: 'assets/templates/management/students.html',
      controller: 'StudentManagementCtrl',
      resolve:{
        "check":function($location, Session, USER_ROLES, NO_ORGANIZATION_SOID){   
            if(Session.userId == null)
              $location.path("/");
            else if(!Session.userRoles.includes(USER_ROLES.manager) || Session.member.FacilitySoid == NO_ORGANIZATION_SOID)
              $location.path("/MyAccount/New");
        }
      }
    })
    .state('courseAssignments', {
      url: '/Management/CourseAssignments',
      templateUrl: 'assets/templates/management/courseManagement.html',
      controller: 'CourseManagementCtrl',
      resolve:{
        "check":function($location, Session, USER_ROLES, NO_ORGANIZATION_SOID){   
            if(Session.userId == null || !Session.userRoles)
              $location.path("/");
            else if(Session.userRoles.includes(USER_ROLES.manager) || Session.member.FacilitySoid == NO_ORGANIZATION_SOID)
              $location.path("/MyAccount/New");
        }
      }
    })
    .state('player', {
      url: '/:lectureName/Video/:lectureSoid',
      templateUrl: 'assets/templates/main/player.html',
      controller: 'PlayerCtrl',
      resolve:{
        "check":function($location, $stateParams, Session, Account, USER_ROLES){   
            if(Session.userId != null){
              if(!$stateParams['lectureSoid'])
                  $location.path("/MyAccount/New");
            }else
              $location.path("/");
        }
      }
    })
    .state('test', {
      url: '/:lectureName/Test/:lectureSoid',
      templateUrl: 'assets/templates/main/test.html',
      controller: 'TestCtrl',
      resolve:{
        "check":function($location, $stateParams, Session, Account, USER_ROLES){   
            if(Session.userId != null){
              if(!$stateParams['lectureSoid'])
                  $location.path("/MyAccount/New");
            }else
              $location.path("/");
        }
      }
    })
    .state('homeSucceed', {
      url: '/Succeed',
      templateUrl: '/assets/templates/succeed/home.html',
      controller: 'HomeCtrl'
    })
    .state('testSucceed', {
      url: '/Succeed/:lectureName/Test/:lectureSoid',
      templateUrl: 'assets/templates/main/test.html',
      controller: 'TestCtrl'
    })
    .state('testResultSucceed', {
      url: '/Succeed/Class/TestResults/:lectureSoid',
      templateUrl: 'assets/templates/succeed/diploma.html',
      controller: 'DiplomaCtrl'
    })
    .state('playerSucceed', {
      url: '/Succeed/:lectureName/Video/:lectureSoid',
      templateUrl: 'assets/templates/main/player.html',
      controller: 'PlayerCtrl'
    });
    
    $urlRouterProvider.otherwise(function($injector, $location){
      var state = $injector.get('$state');
      if($location.path().includes("Succeed") || $location.path().includes("succeed"))  
        state.go("homeSucceed");
      else
        state.go("home");
        
      return $location.path();
    });
    
}]);