(function($C){
    QUnit.module('Object.prototype', {
        beforeEach: function() {
            $C.bind();
        },
        afterEach: function() {
            $C.unbind();
        }
    });

    QUnit.test('$clone', function(assert) {
    	var obj = {attr: "test"};
    	assert.deepEqual(obj.$clone(), obj, 'can clone an object');
    	var complexObj = {arr: [1,2,"3"], obj: {attr: "test"}};
    	assert.deepEqual(complexObj.$clone(), complexObj, 'can clone a complex object');

    });

    QUnit.test('$equal', function(assert) {
    	var obj = {attr: "test"};
    	var obj1 = {attr: "test"};
    	var obj2 = {att: "test"};
    	var obj3 = {attr: "Test"};
    	var obj4 = {att: "test", attr: "Test"};
    	var complexObj = {arr: [1,2,"3"], obj: {attr: "test"}};
    	var complexObj1 = {arr: [1,2,"3"], obj: {attr: "test"}};
    	assert.deepEqual(obj.$equal(obj1), true, 'two objects have the same attribute and value');
    	assert.deepEqual(complexObj.$equal(complexObj1), true, 'two objects have the same attribute and value');
    });
}(CherryJs));