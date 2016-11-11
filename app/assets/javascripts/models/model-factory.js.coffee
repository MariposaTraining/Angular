angular.module('mariposa-training').factory 'ModelFactory', ['$http', ($http) ->
  create: (path, ModelClass) ->
    class RestfulModelClass extends ModelClass
    
      constructor: (attrs) ->
        # Embed model attributes
        @apiEndpoint = path
        @attributes = []
        for k, v of attrs
          this[k] = v
          @attributes.push k
        
        # Call the afterInitialize hook  
        @afterInitialize?()
          
      save: ->
        params = {}
        # Determine which properties to send
        for k in @attributes
          params[k] = this[k]
          
        @beforeSave?()
        $http.put "#{path}/#{@attributes['id']}", params
        
      destroy: ->
        $http.delete "#{path}/#{@id}"
        
      @all: ->
        $http.get "#{path}.json"
      
      @find: (id) ->
        $http.get("#{path}/#{id}.json").then (response) ->
          new RestfulModelClass response.data
          
    RestfulModelClass
]