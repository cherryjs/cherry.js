QUnit.module('String.prototype');

QUnit.test('$trim', function(assert) {
	var str1 = "  test  ";
	assert.deepEqual(str1.$trim(), "test", 'remove spaces at the start and at the end of the string');
    var str2 = "   t e s t   ";
    assert.deepEqual(str2.$trim(), "t e s t", 'won\'t remove spaces in the string');
    var strEmpty = "";
    assert.deepEqual(strEmpty.$trim(), "", 'trim an empty string');
});


QUnit.test('$removeSpace', function(assert) {
    var str1 = "  t e s t  ";
    assert.deepEqual(str1.$removeSpace(), "test", 'remove spaces in the string');
    var str2 = " t\te\ns\rt ";
    assert.deepEqual(str2.$removeSpace(), "test", 'remove \\t, \\n, \\r in the string');
    var strEmpty = "";
    assert.deepEqual(strEmpty.$trim(), "", 'remove space for an empty string');
});
