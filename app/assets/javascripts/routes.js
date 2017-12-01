/* global angular */

angular.module('mariposa-training')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider){
  
  $locationProvider.html5Mode(true);
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/assets/templates/main/home.html',
      controller: 'HomeCtrl',
      resolve:{
        "check":function($state, Session, Account){   
            if(Session.userId != null){
                Account.goToDefaultTab();
            }
          }
      },
      data: {
        metaTitle: "Long Term Care Quality Training & Education - Mariposa",
        metaDescription: "Mariposa Training is a leading provider of internet-based senior and geriatric healthcare training for administrators, nurses and staff caring for the elderly."
      }
    })
    .state('about', {
      url: '/AboutUs',
      templateUrl: 'assets/templates/footer/about.html',
      controller: 'HomeCtrl',
      data: {
        metaTitle: "About Us | Quality Training & Education  - Mariposa Training",
        metaDescription: "Mariposa Training is a leading provider of internet-based senior and geriatric healthcare training for administrators, nurses and staff caring for the elderly."
      }
    })
    .state('policy', {
      url: '/PrivacyPolicy',
      templateUrl: 'assets/templates/footer/policy.html',
      controller: 'HomeCtrl',
      data: {
        metaTitle: "Privacy Policy - Mariposa Training",
        metaDescription: "Mariposa Training is the sole owner of the information collected on this site and we are serious about protecting your privacy."
      }
    })
    .state('faq', {
      url: '/FAQ',
      templateUrl: 'assets/templates/footer/faq.html',
      controller: 'HomeCtrl',
      data: {
        metaTitle: "FAQ | Quality Training & Education - Mariposa Training",
        metaDescription: "How much does it cost? What CEUs do you offer? Questions about our classes and certifications? Take a look at our FAQ!"
      }
    })
    .state('terms', {
      url: '/Terms&Conditions',
      templateUrl: 'assets/templates/footer/terms.html',
      controller: 'HomeCtrl',
      data: {
        metaTitle: "Terms & Conditions - Mariposa Training",
        metaDescription: "Please read these terms and conditions carefully. By your use of this website, you agree to be bound by and comply with the terms and conditions below."
      }
    })
    .state('contact', {
      url: '/ContactUs',
      templateUrl: 'assets/templates/footer/contact.html',
      controller: 'HomeCtrl',
      data: {
        metaTitle: "Contact Us | Training & Education - Mariposa Training",
        metaDescription: "Our goal is to be the best destination for cost-effective web-based training for nursing homes, long term care and other senior care facility staff. Contact us!"
      }
    })
    .state('classes', {
      url: '/Catalog/Classes',
      templateUrl: 'assets/templates/main/classes.html',
      controller: 'ClassesCtrl',
      data: {
        metaTitle: "Classes | Catalog - Mariposa Training",
        metaDescription: "We have 50+ classes available for long-term care and nursing home professionals. Learn more about our classes and how to earn Continuing Education credits."
      }
    })
    .state('certifications', {
      url: '/Catalog/Certifications',
      templateUrl: 'assets/templates/main/certifications.html',
      controller: 'CertificationsCtrl',
      data: {
        metaTitle: "Certifications | Catalog - Mariposa Training",
        metaDescription: "We offer both Level I & II Certificates of Training as a Dementia Care Provider. Gain the knowledge, skill and abilities to help those with dementia thrive."
      }
    })
    .state('bundles', {
      url: '/Catalog/Bundles',
      templateUrl: 'assets/templates/main/bundles.html',
      controller: 'BundlesCtrl',
      data: {
        metaTitle: "Bundles | Catalog - Mariposa Training",
        metaDescription: "We offer 5 different training bundles. Choose from Dementia Survey Response, Unlimited Training, Leadership Bundle, Nursing Bundle, or Culture Change Bundle."
      }
    })
    .state('classDescription', {
      url: '/Class/LearnMore/:Soid',
      templateUrl: 'assets/templates/main/classDescription.html',
      controller: 'ClassDescriptionCtrl'
    })
    .state('longtermIndividual', {
      url: '/Long-Term-Care/Individual',
      templateUrl: 'assets/templates/main/longtermIndividual.html',
      controller: 'LongtermCtrl',
      data: {
        metaTitle: "Individual | Long Term Care - Mariposa Training",
        metaDescription: "We are experts in educating long term care professionals in nursing homes, skilled nursing, assisted living, and residential care facilities. Register today!"
      }
    })
    .state('longtermFacilities', {
      url: '/Long-Term-Care/Facilities',
      templateUrl: 'assets/templates/main/longtermFacilities.html',
      controller: 'LongtermCtrl',
      data: {
        metaTitle: "Facilities | Long Term Care - Mariposa Training",
        metaDescription: "We believe the path to great care, a sterling reputation and reduced risk of future litigation begins with great education. Talk to an expert to learn more!"
      }
    })
    .state('homecareFacilities', {
      url: '/Home-Health-Care/Facilities',
      templateUrl: 'assets/templates/main/homecareFacilities.html',
      controller: 'HomecareCtrl',
      data: {
        metaTitle: "Facilities | Home Healthcare - Mariposa Training",
        metaDescription: "We'll help you remain in compliance with changing state and Federal regulations through \"best in class\" continuing education and record keeping. Learn more!"
      }
    })
    .state('homecareIndividual', {
      url: '/Home-Health-Care/Individual',
      templateUrl: 'assets/templates/main/homecareIndividual.html',
      controller: 'HomecareCtrl',
      data: {
        metaTitle: "Individual | Home Healthcare - Mariposa Training",
        metaDescription: "We are leading experts in the development of gerontological education for home health & home healthcare professionals. Register and try a free class with us!"
      }
    })
    .state('whitepapers', {
      url: '/Resources',
      templateUrl: 'assets/templates/main/resources.html',
      controller: 'ResourcesCtrl'
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
            else if(Session.userRoles.indexOf(USER_ROLES.manager) == -1 || Session.member.FacilitySoid == NO_ORGANIZATION_SOID)
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
            else if(Session.userRoles.indexOf(USER_ROLES.manager) == -1 || Session.member.FacilitySoid == NO_ORGANIZATION_SOID)
              $location.path("/MyAccount/New");
        }
      }
    })
    .state('player', {
      url: '/:lectureName/Video/:lectureSoid',
      templateUrl: 'assets/templates/main/player.html',
      controller: 'PlayerCtrl',
      resolve:{
        "check":function($location, $stateParams, Session){
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
        "check":function($location, $stateParams, Session, Account, USER_ROLES, Logger){ 
            Logger.logData("Routes.js: to state test for Mariposa users", "lecture: " + $stateParams['lectureSoid']);
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
      url: '/Succeed/:lectureName/Test/:lectureSoid/:fullName',
      templateUrl: 'assets/templates/main/test.html',
      controller: 'TestCtrl'
    })
    .state('testResultSucceed', {
      url: '/Succeed/Class/TestResults/:lectureSoid/:fullName',
      templateUrl: 'assets/templates/succeed/diploma.html',
      controller: 'DiplomaCtrl'
    })
    .state('playerSucceed', {
      url: '/Succeed/:lectureName/Video/:lectureSoid/:fullName',
      templateUrl: 'assets/templates/main/player.html',
      controller: 'PlayerCtrl'
    });
  /*  .state('dementiaCareLandingPage', {
      url: '/Dementia-Care',
      templateUrl: 'assets/templates/landingPages/dementiaCare.html',
      controller: 'LandingPageCtrl'
    });*/
    
    $urlRouterProvider.otherwise(function($injector, $location){
      var state = $injector.get('$state');
      if($location.path().indexOf("Succeed") != -1 || $location.path().indexOf("succeed") != -1)  
        state.go("homeSucceed");
      else if ($location.path().indexOf("Home/aboutus") != -1)
        state.go("about");
      else if ($location.path().indexOf("Longtermcare/individual") != -1)
        state.go("longtermIndividual");
      else if ($location.path().indexOf("Home/FAQ") != -1)
        state.go("faq");
      else if ($location.path().indexOf("Cart/AnonymousSummary") != -1)
        state.go("cart");
      else
        state.go("home");
        
      return $location.path();
    });
    
}]);