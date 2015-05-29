QUnit.module('Object.prototype');

QUnit.test('$clone', function(assert) {
    function X() {
        this.x = 5;
        this.arr = [1,2,3];
    }
    var obj = { d: new Date(), r: /abc/ig, x: new X(), arr: [1,2,3], n: null, u: undefined },
        obj2,
        clone;

    obj.x.xx = new X();
    obj.arr.testProp = "test";
    clone = obj.$clone();

    //Date
    assert.notStrictEqual(obj.d, clone.d, 'Date has been deep cloned.');
    assert.deepEqual(obj.d.valueOf(), clone.d.valueOf(), 'And the values of two Date are equal');
    //RegExp
    assert.notStrictEqual(obj.r, clone.r, 'RegExp has been deep cloned.');
    assert.deepEqual(obj.r.valueOf(), clone.r.valueOf(), 'And the values of two RegExp are equal');
    //User-defined Object
    assert.notStrictEqual(obj.x, clone.x, 'Object:X has been deep cloned.');
    assert.strictEqual(clone.x instanceof X, true, 'The copy is with type X');
    assert.deepEqual(obj.x.valueOf(), clone.x.valueOf(), 'And the values of two X are equal');
    //Arrays
    assert.notStrictEqual(obj.arr, clone.arr, 'Array has been deep cloned.');
    assert.deepEqual(obj.arr.testProp, clone.arr.testProp, 'Keep props of Arrays');
    assert.deepEqual(obj.arr.valueOf(), clone.arr.valueOf(), 'And the values of two Arrays are equal');

    //Circular structure
    obj = {};
    obj2 = { o:obj };
    obj.o = obj2;
    clone = obj.$clone();

    assert.notStrictEqual(obj, clone, 'The first part of circular structure has been deep cloned.');
    assert.notStrictEqual(obj2, clone.o, 'The second part of circular structure has been deep cloned.');
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
    }, /MeaninglessEqual/, 'Cannot call $equal on a object which contains a circular structure');
});