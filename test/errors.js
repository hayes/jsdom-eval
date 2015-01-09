var methods = [
  func,
  method,
  anonFunc,
  ananMethod,
  constructorFunc,
  constructorMethod,
  constructorAnonFunc,
  constructorAnanMethod,
]

methods.forEach(function(f) {
  process.nextTick(function() {
    f()
  })
})

function func() {
  foo()

  function foo() {
    throw new Error()
  }
}

function method() {
  var o = {
    f: foo
  }

  o.f()

  function foo() {
    throw new Error()
  }
}

function anonFunc() {
  (function() {
    throw new Error()
  })()
}

function ananMethod() {
  var o = {
    f: function() {
      throw new Error()
    }
  }

  o.f()
}


function constructorFunc() {
  new foo()

  function foo() {
    throw new Error()
  }
}

function constructorMethod() {
  var o = {
    f: foo
  }

  new o.f()

  function foo() {
    throw new Error()
  }
}

function constructorAnonFunc() {
  new (function() {
    throw new Error()
  })()
}

function constructorAnanMethod() {
  var o = {
    f: function() {
      throw new Error()
    }
  }

  new o.f()
}
