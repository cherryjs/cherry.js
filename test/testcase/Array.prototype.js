(function($C){
    QUnit.module('Array.prototype', {
        beforeEach: function() {
            $C.bind();
        },
        afterEach: function() {
            $C.unbind();
        }
    });

    QUnit.test('$swap', function(assert) {
        assert.deepEqual([1, 2, 3].$swap(0, 1), [2, 1, 3],
            'swap [index1] with [index2] (index1 != index2)');
        assert.deepEqual([1, 2, 3].$swap(0, 0), [1, 2, 3],
            'swap [index] with [index] (index < arr.length)');
        assert.deepEqual([1, 2, 3].$swap(3, 3), [1, 2, 3],
            'swap [index] with [index] (index > arr.length)');
        assert.deepEqual([1, 2, 3].$swap(0, 3), [1, 2, 3],
            'swap [index1] with [index2] (index1 < arr.length && index2 > arr.length)');
    });

    QUnit.test('$intersect', function(assert) {
        var arr1 = ['jerry', 'zou', 'nee'],
            arr2 = ['nee', 'huan'];
        assert.deepEqual(arr1.$intersect(arr2), ['nee'], 'can take the set intersection of two arrays');
        var dupArr = ['jerry', 'jerry', 'jerry', 'nee', 'abc'];
        assert.deepEqual(dupArr.$intersect(arr1), ['jerry', 'nee'], 'returns a duplicate-free array');
        var result = [2, 3, 4, 1].$intersect([1, 2, 3]);
        assert.deepEqual(result, [2, 3, 1], 'preserves order of first array');
        result = [1, 2, 3].$intersect(null);
        assert.deepEqual(result, [], 'returns an empty array when passed null as argument beyond the first');
    });

    QUnit.test('$unite', function(assert) {
        var arr = ['jerry', 'zou' ];
        assert.deepEqual(['jerry'].$unite(['nee']), ['jerry', 'nee'], 'can take the set union of two arrays');
        var result = [2, 3, 4, 1].$unite([1, 2, 5, 3]);
        assert.deepEqual(result, [2, 3, 4, 1, 5], 'preserves order of first array and then the second');
        var dupArr = ['jerry', 'jerry', 'jerry', 'nee', 'huan'];
        assert.deepEqual(dupArr.$unite(arr), ['jerry', 'nee', 'huan', 'zou'], 'returns a duplicate-free array');
        result = [1, 2, 3].$unite(null);
        assert.deepEqual(result, [1, 2, 3], 'returns an first array when passed null as argument');
    });
}(CherryJs));