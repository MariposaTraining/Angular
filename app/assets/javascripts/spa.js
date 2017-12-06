/* global angular */

var app = angular.module('mariposa-training', ['ui.router', 'templates', 'ngSanitize', 'ngStorage', 'ngAudio'])
  .controller('ApplicationCtrl', ['$scope', '$state', '$stateParams', '$sessionStorage', '$localStorage', '$rootScope', '$window', 'AuthService', 'Cart', 'Session', 'Catalog', 'Transaction', 'Account', 'Management', 'Layout', 'USER_ROLES', 'NO_ORGANIZATION_SOID',
  function($scope, $state, $stateParams, $sessionStorage, $localStorage, $rootScope, $window, AuthService, Cart, Session, Catalog, Transaction, Account, Management, Layout, USER_ROLES, NO_ORGANIZATION_SOID){
    
    $rootScope.$state = $state;
      
    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 
        $sessionStorage.lastState = toState.name;
    });
   
    $scope.init = function(){
      
      document.title = "Long Term Care Quality Training & Education - Mariposa";
      document.querySelector("meta[name=description]").content= "Mariposa Training is a leading provider of internet-based senior and geriatric healthcare training for administrators, nurses and staff caring for the elderly.";
      $scope.Account = Account;
      $scope.Cart = Cart;
      $scope.Transaction = Transaction;
      $scope.Session = Session;
      $scope.Management = Management;
      $scope.isAuthorized = AuthService.isAuthorized;
      $scope.USER_ROLES = USER_ROLES;
      $scope.NO_ORGANIZATION_SOID = NO_ORGANIZATION_SOID;
      Catalog.getData();
  
      if($sessionStorage.identifier){ 
        $scope.Session.loadFromSessionStorage();
        Account.loadMemberObject();
      }
      
      if($sessionStorage.lastState && !$sessionStorage.newState) 
        $state.go($sessionStorage.lastState);
      else if($sessionStorage.newState) 
        $state.go($sessionStorage.newState, {lectureSoid: $localStorage.lectureSoidToReload});
      
      $scope.Cart.getCart();
      $scope.$state = $state;
      Layout.init();
    };
    
    $scope.init();
    
    $scope.signOut = function(){
      $scope.Cart.removeAllItems();
      $scope.Session.destroy(); 
      $scope.Transaction.destroy();
      $scope.Account.destroy();
      $scope.Management.destroy();
      $state.go('home');
    };
    
    $scope.homeLinkClicked = function(){
      if($scope.Session.userId != null)
        $scope.Account.goToDefaultTab();
      else
        $state.go("home");
    };
    
    $scope.reloadPage = function(){
      $window.location.reload();
    };
    
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      if($state.current.name != 'classDescription'){
        
        if($state.current.data != null && $state.current.data.metaTitle != null && $state.current.data.metaDescription != null){
        
          document.title = $state.current.data.metaTitle;
          document.querySelector("meta[name=description]").content = $state.current.data.metaDescription;
        }else{
          document.title = "Long Term Care Quality Training & Education - Mariposa";
          document.querySelector("meta[name=description]").content= "Mariposa Training is a leading provider of internet-based senior and geriatric healthcare training for administrators, nurses and staff caring for the elderly.";
        }
      }else{
        document.title = CLASS_METATAGS[toParams["Soid"]].title;
        document.querySelector("meta[name=description]").content=CLASS_METATAGS[toParams["Soid"]].description;
      }
    });
    
    var CLASS_METATAGS = {
      "52e1063bb8666e1bd01d9383": {
        title: "Advance Care Planning | Classes - Mariposa",
        description: "This empowering presentation allows participants to explore Advance Care Planning, including the vital components of life care planning and quality of life."
      },
      "5172bb78dbbf5813546c5710": {
        title: "Advance Directives | Classes - Mariposa",
        description: "Gain confidence in your ability to support residents and their families with the comfort that their healthcare wishes are understood by using Advance Directives"
      },
      "5172bb78dbbf5813546c578d": {
        title: "Advocacy - Beyond Resident Rights | Classes - Mariposa",
        description: "In this presentation, participants will explore how to expand our advocacy efforts to safeguard the rights of residents and truly enhance their quality of life."
      },
      "5172bb8adbbf5813546c6912": {
        title: "Who Are the Elderly? | Classes - Mariposa",
        description: "Participants will gain knowledge which dispels commonly held misconceptions about the elderly, and will explore the implications of these prejudices."
      },
      "5172bb79dbbf5813546c57da": {
        title: "Ancillary Services | Classes - Mariposa",
        description: "Better understand the ancillary needs of your residents, effects of these services on resident quality of life, and the regulations surrounding their delivery."
      },
      "5172bb72dbbf5813546c5017": {
        title: "Behavior Management | Classes - Mariposa",
        description: "Gain the knowledge and abilities necessary to identify dementia/delirium based behavioral triggers (antecedents) and the skills needed to prevent their onset."
      },
      "5172bb86dbbf5813546c6441": {
        title: "Capacity Versus Competency | Classes - Mariposa",
        description: "Participants are given the knowledge, skills and abilities needed to make informed decisions about the competence and capacity of their residents."
      },
      "5172bb6fdbbf5813546c4d77": {
        title: "Census Challenges | Classes - Mariposa",
        description: "This webinar explores a creative marketing approach to drive census and attract the residents you want. Register now to improve your marketing outreach!"
      },
      "5172bb72dbbf5813546c5092": {
        title: "Communication Tools | Classes - Mariposa",
        description: "Learn to communicate more effectively with those you care for, thereby reducing agitation and resistance to care by behaviorally challenged residents."
      },
      "5172bb8adbbf5813546c67ef": {
        title: "Technology-Based Brain Fitness Program | Classes - Mariposa",
        description: "This seminar addresses how to successfully implement a computer-based brain fitness program, for widespread use by residents in a senior living environment."
      },
      "5172bb73dbbf5813546c517f": {
        title: "Creating a 4 Star Dining Experience | Classes - Mariposa",
        description: "This webinar shows how to create a truly successful dining experience focusing on the nutritional, social and sensory aspects of the mealtime experience."
      },
      "5172bb77dbbf5813546c5661": {
        title: "Cultural Diversity | Classes - Mariposa",
        description: "This webinar will discuss the importance of embracing a culturally diverse resident population and its integration into the scope of services provided."
      },
      "5172bb6edbbf5813546c4c6a": {
        title: "Culture Change | Classes - Mariposa",
        description: "Explore an individualized model of care, in which the plan is truly reflective of the needs, interests, customs and personal preferences of each resident."
      },
      "5172bb7bdbbf5813546c58de": {
        title: "Dealing With Death And Dying | Classes - Mariposa",
        description: "During this webinar, participants will learn how to deal with the inevitable grief that accompanies the death of those we have come to care for."
      },
      "5172bb71dbbf5813546c4f76": {
        title: "Dementia And Delirium Diagnosis | Classes - Mariposa",
        description: "Learn to differentiate between dementia and delirium, as well as better understand the often reversible environmental, situational and human factor antecedents."
      },
      "5172bb7ddbbf5813546c5b10": {
        title: "Discharge Planning Guidelines | Classes - Mariposa",
        description: "Gain valuable knowledge, skills and resources to support your residents, their family and your facility in the safe and successful discharge of your residents."
      },
      "5172bb76dbbf5813546c5420": {
        title: "Building a Successful Volunteer Program | Classes - Mariposa",
        description: "Use this webinar to explore proven strategies to build and maintain a dynamic volunteer program based on an understanding of individual volunteer motivations."
      },
      "5172bb76dbbf5813546c54c4": {
        title: "Effective Time Management | Classes - Mariposa",
        description: "Learn how to evaluate the effectiveness of your own time management strategies as well as explore insightful new approaches to managing your time and workload."
      },
      "5172bb87dbbf5813546c64c5": {
        title: "Elopement Prevention | Classes - Mariposa",
        description: "This course arms facility staff with the skills and knowledge to reduce the potential for unsafe wandering and elopement among cognitively impaired residents."
      },
      "5172bb6ddbbf5813546c4b4c": {
        title: "Enabling Freedom | Classes - Mariposa",
        description: "Learn to evaluate and modify the environment to support our residents with cognitive impairment as they age in place."
      },
      "5172bb7edbbf5813546c5c58": {
        title: "F-329 Unnecessary Medication | Classes - Mariposa",
        description: "This presentation explores the use (and misuse) of pharmacological intervention in the care of residents with dementia and/or delirium based behaviors."
      },
      "5172bb70dbbf5813546c4e6e": {
        title: "Fall Management Guide | Classes - Mariposa",
        description: "This webinar will provide caretakers with the knowledge, skills and abilities necessary to identify and prevent falls and fall related injuries."
      },
      "5172bb88dbbf5813546c665e": {
        title: "Fall Prevention | Classes - Mariposa",
        description: "Within this class, participants will learn to identify factors which increase the risk for falls, as well as strategies for reducing falls and related injuries."
      },
      "5172bb75dbbf5813546c53a4": {
        title: "Family Support | Classes - Mariposa",
        description: "Learn how to increase family involvement in the lives of your residents and your facility through exploring proven strategies for nurturing family support."
      },
      "5172bb7fdbbf5813546c5d28": {
        title: "Grievances Guide | Classes - Mariposa",
        description: "During this webinar, participants will learn about the grievance process, and how you can use it to strengthen relationships and grow your facility."
      },
      "53971c75b8666e1760743b0a": {
        title: "Improving Hand Hygiene in Healthcare | Classes - Mariposa",
        description: "Listen to an expert discusses the most up-to-date research, guidelines and best practices to stopping the spread of infection in your healthcare setting."
      },
      "5172bb77dbbf5813546c55df": {
        title: "In Pursuit of Control | Classes - Mariposa",
        description: "In this webinar, participants will examine the importance of choice, control and empowerment, and approaches to empower residents through daily decision making."
      },
      "5172bb80dbbf5813546c5dad": {
        title: "In Pursuit of Intimacy | Classes - Mariposa",
        description: "During this webinar, participants will gain a deeper understanding of the meanings behind expressions of intimacy among your residents."
      },
      "5172bb6edbbf5813546c4be5": {
        title: "Interdisciplinary Care Planning | Classes - Mariposa",
        description: "Encourage the Interdisciplinary Treatment Team (IDT) to work together and view the Care Plan as a resident-centered effort to enhance the resident's care."
      },
      "5172bb81dbbf5813546c5ef1": {
        title: "MDS 3.0 Training Social Service Staff | Classes - Mariposa",
        description: "During this Social Service focused webinar, participants will become familiar with MSD 3.0 and develop the skills to successfully conduct resident interviews."
      },
      "5172bb74dbbf5813546c526e": {
        title: "Managing the Survey Process | Classes - Mariposa",
        description: "Learn how to prepare for, and ultimately manage, the survey process in order to accurately present the best of all that you do for your residents."
      },
      "5172bb71dbbf5813546c4f02": {
        title: "Meaningful Engagement | Classes - Mariposa",
        description: "With this webinar, learn how to build Person Directed Activity programs and services which are truly meaningful to your residents and their unique abilities."
      },
      "5172bb6fdbbf5813546c4cf3": {
        title: "Medical Records Documentation | Classes - Mariposa",
        description: "This informative webinar will guide participants through the \"do's and don'ts\" of the vital aspect of medical records documentation."
      },
      "5172bb8cdbbf5813546c6b04": {
        title: "Montessori Based Activity Programs | Classes - Mariposa",
        description: "During this example filled class, participants will learn to understand the Montessori approach to dementia care, as well as how to implement the approach."
      },
      "5172bb87dbbf5813546c6575": {
        title: "Our Angry Resident | Classes - Mariposa",
        description: "Learn the tools for identifying the factors that may have contributed to a resident’s anger, and behavioral strategies for dealing with the angry resident."
      },
      "5172bb82dbbf5813546c5f8e": {
        title: "Person Directed Care | Classes - Mariposa",
        description: "This webinar outlines an applied understanding of Person Directed Care - the best practice approach to providing care which is truly individualized."
      },
      "5172bb86dbbf5813546c6384": {
        title: "Preventing Abuse and Neglect | Classes - Mariposa",
        description: "This presentation is to provide training relative to the various types of abuse and neglect, as well as to define the process for mandated abuse reporting."
      },
      "52c90a00b8666e1740b54492": {
        title: "Resident Right Guide | Classes - Mariposa",
        description: "In this engaging discussion of Resident Rights, participants explore practical implications of these rights through guided discovery and real life examples."
      },
      "52c90b59b8666e1740b5ac02": {
        title: "Restraint Reduction | Classes - Mariposa",
        description: "This class examines the regulations related to restraints and provides approaches for the care of more challenging residents without the use of restraints."
      },
      "5172bb8bdbbf5813546c69fc": {
        title: "Risk Management | Classes - Mariposa",
        description: "This purpose of this course is to educate staff about the issues which typically lead to elder abuse cases and other tort claims and how to limit exposure."
      },
      "533ec8c2b8666e1208321c4d": {
        title: "Sleep Disorders | Classes - Mariposa",
        description: "Learn to implement a treatment plan for sleep disorders and identify some of the challenges associated with establishing a successful sleep program."
      },
      "5172bb70dbbf5813546c4dee": {
        title: "Stress Management | Classes - Mariposa",
        description: "Stress management is key to workplace health and safety. This class will teach you to reduce stress and enhance overall personal and professional well-being."
      },
      "5172bb8cdbbf5813546c6b9a": {
        title: "Suicide and the Elderly | Classes - Mariposa",
        description: "This class provides the skills and knowledge necessary to care for residents at risk for suicide, as well as the ability to identify early warning signs."
      },
      "5172bb76dbbf5813546c5562": {
        title: "Supporting the Challenging Family | Classes - Mariposa",
        description: "Learn how to work with \"challenging\" family members in order to generate supportive family involvement and enhance the overall quality of resident life."
      },
      "5172bb73dbbf5813546c50f7": {
        title: "Technology Today | Classes - Mariposa",
        description: "This webinar will identify several economical, senior friendly products and services with the potential to significantly enhance the quality of resident life."
      },
      "5172bb75dbbf5813546c532c": {
        title: "The Invisible Resident | Classes - Mariposa",
        description: "In this webinar, participants will learn how to identify, re-engage and prevent the occurrence of the disassociated resident and improve their quality of life."
      },
      "5172bb83dbbf5813546c5ff6": {
        title: "Transfer Trauma | Classes - Mariposa",
        description: "The move to a new facility or room can have life shattering consequences. Learn to identify and prevent the occurrence of this avoidable negative outcome."
      },
      "5172bb89dbbf5813546c66f7": {
        title: "Uncovering Your Creativity Part 1 | Classes - Mariposa",
        description: "Part 1 of this webinar serves as a primer on creativiy and critical thinking in the workplace as participants strive to improve the quality of resident life."
      },
      "5172bb89dbbf5813546c679b": {
        title: "Uncovering Your Creativity Part 2 | Classes - Mariposa",
        description: "Part 2 of this webinar shows participants how to use creative thinking techniques to engage clients and to incorporate these techniques into their daily life."
      },
      "5172bb84dbbf5813546c60ec": {
        title: "Understanding Mental Illness | Classes - Mariposa",
        description: "Caring for a resident with a mental illness is both challenging and rewarding. Learn how to support these residents in order to enhance their quality of life."
      },
      "5172bb85dbbf5813546c619f": {
        title: "Understanding Psychotropic Medication | Classes - Mariposa",
        description: "This presentation will give participants an overview of the types, classifications and indications of psychotropic medications and potential side effects."
      },
      "5172bb85dbbf5813546c62af": {
        title: "Understanding Psychosocial Needs | Classes - Mariposa",
        description: "With the growing number of younger residents within skilled nursing facilities, learn how to identify and meet the psychosocial needs of your younger residents."
      }
    };
    
}]);

app.constant('USER_ROLES', (function() {
    return {
      manager: 'manager',
      student: 'student'
    };
})());

app.constant('NO_ORGANIZATION_SOID', (function() {
    return "5760ddf5eabbde0e0cdbff47";
})());

app.constant('ITEM_TYPES', (function() {
    return {
      course: 1,
      certification: 2,
      bundle: 3
    };
})());

app.constant('US_STATES', (function() {
    return {
      vals: [
        {value: 'AL', name: 'Alabama'},
        {value: 'AK', name: 'Alaska'},
        {value: 'AZ', name: 'Arizona'},
        {value: 'AR', name: 'Arkansas'},
        {value: 'CA', name: 'California'},
        {value: 'CO', name: 'Colorado'},
        {value: 'CT', name: 'Connecticut'},
        {value: 'DE', name: 'Delaware'},
        {value: 'FL', name: 'Florida'},
        {value: 'GA', name: 'Georgia'},
        {value: 'HI', name: 'Hawaii'},
        {value: 'ID', name: 'Idaho'},
        {value: 'IL', name: 'Illinois'},
        {value: 'IN', name: 'Indiana'},
        {value: 'IA', name: 'Iowa'},
        {value: 'KS', name: 'Kansas'},
        {value: 'KY', name: 'Kentucky'},
        {value: 'LA', name: 'Louisiana'},
        {value: 'ME', name: 'Maine'},
        {value: 'MD', name: 'Maryland'},
        {value: 'MA', name: 'Massachusetts'},
        {value: 'MI', name: 'Michigan'},
        {value: 'MN', name: 'Minnesota'},
        {value: 'MS', name: 'Mississippi'},
        {value: 'MO', name: 'Missouri'},
        {value: 'MT', name: 'Montana'},
        {value: 'NE', name: 'Nebraska'},
        {value: 'NV', name: 'Nevada'},
        {value: 'NH', name: 'New Hampshire'},
        {value: 'NJ', name: 'New Jersey'},
        {value: 'NM', name: 'New Mexico'},
        {value: 'NY', name: 'New York'},
        {value: 'NC', name: 'North Carolina'},
        {value: 'ND', name: 'North Dakota'},
        {value: 'OH', name: 'Ohio'},
        {value: 'OK', name: 'Oklahoma'},
        {value: 'OR', name: 'Oregon'},
        {value: 'PA', name: 'Pennsylvania'},
        {value: 'RI', name: 'Rhode Island'},
        {value: 'SC', name: 'South Carolina'},
        {value: 'SD', name: 'South Dakota'},
        {value: 'TN', name: 'Tennessee'},
        {value: 'TX', name: 'Texas'},
        {value: 'UT', name: 'Utah'},
        {value: 'VT', name: 'Vermont'},
        {value: 'VA', name: 'Virginia'},
        {value: 'WA', name: 'Washington'},
        {value: 'WV', name: 'West Virginia'},
        {value: 'WI', name: 'Wisconsin'},
        {value: 'WY', name: 'Wyoming'}
      ]
    };
    
})());

app.constant('TIME_ZONES', (function() {
    return {
      vals: [
        {value: "Hawaiian Standard Time", label: "(UTC-10:00) Hawaii"},
        {value: "Alaskan Standard Time", label: "(UTC-09:00) Alaska"},
        {value: "Pacific Standard Time", label: "(UTC-08:00) Pacific Time"},
        {value: "US Mountain Standard Time", label: "(UTC-07:00) Arizona"},
        {value: "Mountain Standard Time", label: "(UTC-07:00) Mountain Time"},
        {value: "Central Standard Time", label: "(UTC-06:00) Central Time"},
        {value: "Canada Central Standard Time", label: "(UTC-06:00) Saskatchewan"},
        {value: "Eastern Standard Time", label: "(UTC-05:00) Eastern Time"},
        {value: "US Eastern Standard Time", label: "(UTC-05:00) Indiana (East)"}
      ]
    };
    
})());


