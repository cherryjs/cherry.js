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
        var cyclicObj = {};
        var cyclicObj2 = {obj: cyclicObj};
        cyclicObj.obj = cyclicObj2;
        assert.throws(function(assert){
            cyclicObj.$clone();
        }, 'return null when cloning a cyclic object.');
    });

    QUnit.test('$isRing', function(assert) {
        var obj = {
            a: 1,
            b: '23',
            c: {
                x: { a: 'test' },
                y: { a: 'test' }
            }
        };
        assert.strictEqual(obj.$isRing(), false, 'judge a object which contains no ring');

        var obj = {},
            anotherObj = { a: obj };
        obj.b = anotherObj;
        assert.strictEqual(obj.$isRing(), true, 'judge a simple object which contains a ring.');

        var obj = { arr: [] },
            obj1 = {},
            obj2 = { o: obj1 },
            obj3 = { o: obj2 };
        obj1.o = obj3;
        obj.arr.push(obj2);
        assert.strictEqual(obj.$isRing(), true, 'judge a complex object which contains a ring.');
    });

    QUnit.test('$equal', function(assert) {
        var obj = { 
            a: "test",
            b: "test",
            arr: [1, 2, "3"],
            subObj: { a: 100 }
        }, anotherObj = {
            a: "test",
            b: "test",
            arr: [1, 2, "3"],
            subObj: { a: 100 }
        };
        assert.deepEqual(obj.$equal(anotherObj), true, 'two objects have the same attribute and value');
        
        //cyclic objects
        obj = {};
        anotherObj = { o: obj };
        obj.o = anotherObj;
        assert.throws(function() {
            obj.$equal(anotherObj);
        }, function(err) {
            return err.toString() === 'Error 12001: Cannot call $equal on a object which contains a ring.';
        }, 'throw Error 12001 when calling $equal on cyclicObj');
    });
}(CherryJs));