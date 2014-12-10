(function($C){
    QUnit.module('Array.prototype', {
        beforeEach: function() {
            $C('bind');
        },
        afterEach: function() {
            $C('unbind');
        }
    });

    test('$swap', function(assert) {
        assert.deepEqual([1, 2, 3].$swap(0,1), [2, 1, 3],
            'swap [index1] with [index2] (index1 != index2)');
        assert.deepEqual([1, 2, 3].$swap(0,0), [1, 2, 3],
            'swap [index] with [index] (index < arr.length)');
        assert.deepEqual([1, 2, 3].$swap(3,3), [1, 2, 3],
            'swap [index] with [index] (index > arr.length)');
        assert.deepEqual([1, 2, 3].$swap(0,3), [1, 2, 3],
            'swap [index1] with [index2] (index1 < arr.length && index2 > arr.length)');
    });
}(CherryJs));