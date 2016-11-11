angular.module('mariposa-training').factory 'BaseModelClass', ->
  class BaseModelClass
    constructor: (attrs) ->
      # Set model attributes
      for k, v of attrs
        this[k] = v
      
      # Call the afterInitialize hook  
      @afterInitialize?()
  
  BaseModelClass