module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  // required to lint *.vue files
  plugins: ['vue', 'html'],
  // check if imports actually resolve

  globals: {
    BMap: true,
    AMap: true,
    AMapUI: true,
    processEnv: true,
    _: true,
    Prism: true,
    QRCode: true,
    QC: true
  },
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // 定义对象的set存取器属性时，强制定义get
    'accessor-pairs': 2,
    // =>的前后空格
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    //如果代码块是单行的时候，代码块内部前后需要留一个空格
    'block-spacing': [2, 'always'],
    // if while function 后面的{必须与if在同一行，java风格。
    'brace-style': [
      0,
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    camelcase: [
      0,
      {
        properties: 'always'
      }
    ],
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    'comma-dangle': [2, 'never'],
    // 控制逗号前后的空格
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    // 控制逗号在行尾出现还是在行首出现
    'comma-style': [2, 'last'],
    // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    // 强制object.key 中 . 的位置，参数:
    //      property，'.'号应与属性在同一行
    //      object, '.' 号应与对象名在同一行
    'dot-location': [2, 'property'],
    'eol-last': 2,
    // 使用 === 替代 ==
    eqeqeq: [1, 'allow-null'],
    //生成器函数*的前后空格
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    //缩进风格
    indent: [
      2,
      2,
      {
        SwitchCase: 1
      }
    ],
    // 对所有不包含单引号的JSX属性值强制使用单引号
    // 'jsx-quotes': [2, 'prefer-single'],
    //对象字面量中冒号的前后空格
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    // 关键字空格
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    //函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
    'new-cap': [
      1,
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    //new时必须加小括号
    'new-parens': 2,
    //禁止使用数组构造器
    'no-array-constructor': 1,
    //禁止使用arguments.caller或arguments.callee
    'no-caller': 2,
    // 禁止使用console
    'no-console': 'off',
    // 禁止给类赋值
    'no-class-assign': 2,
    //禁止在条件表达式中使用赋值语句
    'no-cond-assign': 2,
    //禁止修改const声明的变量
    'no-const-assign': 2,
    //禁止在正则表达式中使用控制字符
    'no-control-regex': 0,
    // 不能对var声明的变量使用delete操作符
    'no-delete-var': 2,
    // 函数参数不能重复
    'no-dupe-args': 2,
    // class中的成员禁止重名
    'no-dupe-class-members': 2,
    // 在对象字面量中，禁止使用重复的key
    'no-dupe-keys': 2,
    // 在switch语句中禁止重复的case
    'no-duplicate-case': 2,
    // 禁止使用不匹配任何字符串的正则表达式
    'no-empty-character-class': 2,
    // 禁止使用不匹配任何字符串的正则表达式
    'no-empty-pattern': 2,
    // 禁止使用eval函数
    'no-eval': 1,
    // 禁止对catch语句中的参数进行赋值
    'no-ex-assign': 2,
    // 禁止扩展原生对象
    'no-extend-native': 2,
    // 禁止在不必要的时候使用bind函数
    'no-extra-bind': 1,
    //在一个本来就会自动转化为布尔值的上下文中就没必要再使用!! 进行强制转化了
    'no-extra-boolean-cast': 1,
    // 禁止使用多余的圆括号
    'no-extra-parens': [2, 'functions'],
    // 在case语句中尽量加break
    'no-fallthrough': 2,
    // 简单来说不要写这样的数字.2 2.。应该写全，2.2 2.0 .
    // 'no-floating-decimal': 2,
    // 禁止对函数名重新赋值
    'no-func-assign': 2,
    // 禁止使用类eval的函数。
    'no-implied-eval': 2,
    // 禁止在代码块中定义函数（下面的规则仅限制函数）
    'no-inner-declarations': [1, 'functions'],
    // RegExp构造函数中禁止使用非法正则语句
    'no-invalid-regexp': 2,
    //禁止使用不规则的空白符
    'no-irregular-whitespace': 2,
    //禁止使用__iterator__属性
    'no-iterator': 2,
    // label和var申明的变量不能重名
    'no-label-var': 2,
    // 禁止使用label语句
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false
      }
    ],
    // 禁止使用没有必要的嵌套代码块
    'no-lone-blocks': 2,
    // 不要把空格和tab混用
    'no-mixed-spaces-and-tabs': 0,
    // 申明语句、数组元素、对象属性、sequences、函数参数中不使用超过一个的空白符
    'no-multi-spaces': 2,
    //该规则保证了字符串不分两行书写。
    'no-multi-str': 2,
    //空行不能够超过2行
    'no-multiple-empty-lines': [
      2,
      {
        max: 2
      }
    ],
    // 该规则保证了不重写原生对象
    'no-native-reassign': 2,
    //在in操作符左边的操作项不能用! 例如这样写不对的：if ( !a in b) { //dosomething }
    'no-negated-in-lhs': 2,
    //不要通过new Object()，来定义对象
    'no-new-object': 1,
    //禁止把require方法和new操作符一起使用。
    'no-new-require': 2,
    'no-new-symbol': 2,
    //当定义字符串、数字、布尔值就不要使用构造函数了，String、Number、Boolean
    'no-new-wrappers': 2,
    //禁止无意把全局对象当函数调用了，比如下面写法错误的：Math(), JSON()
    'no-obj-calls': 2,
    //不要使用八进制的语法。
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-path-concat': 2,
    //不要使用__proto__
    'no-proto': 2,
    //不要重复申明一个变量
    'no-redeclare': 2,
    //正则表达式中不要使用空格
    'no-regex-spaces': 2,
    //return语句中不要写赋值语句
    'no-return-assign': [2, 'except-parens'],
    'no-self-assign': 2,
    //不要和自身作比较
    'no-self-compare': 2,
    //不要使用逗号操作符
    'no-sequences': 2,
    // 禁止对一些关键字或者保留字进行赋值操作，比如NaN、Infinity、undefined、eval、arguments等。
    'no-shadow-restricted-names': 2,
    // 函数调用时，圆括号前面不能有空格
    'no-spaced-func': 2,
    //禁止使用稀疏数组
    'no-sparse-arrays': 2,
    //在调用super之前不能使用this对象
    'no-this-before-super': 2,
    //一般来说，不允许抛出常量，例如 throw 'error' ,正确使用: throw new Error('something wrong')
    'no-throw-literal': 2,
    //行末禁止加空格
    'no-trailing-spaces': 2,
    //禁止使用没有定义的变量，除非在／＊global＊／已经申明
    'no-undef': 2,
    //禁止把undefined赋值给一个变量
    'no-undef-init': 1,
    //禁止在不需要分行的时候使用了分行
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 2,
    //禁止使用没有必要的三元操作符，因为用些三元操作符可以使用其他语句替换
    'no-unneeded-ternary': [
      0,
      {
        defaultAssignment: false
      }
    ],
    //禁止出现不可运行到的代码
    'no-unreachable': 1,
    //是否禁止在case语句中声明变量
    'no-case-declarations': 0,
    // 禁止在 finally 语句块中出现控制流语句
    'no-unsafe-finally': 2,
    // 禁止定义没用没使用的变量
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none'
      }
    ],
    //禁止在不需要使用call（）或者apply（）的时候使用了这两个方法
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 0,
    'no-whitespace-before-property': 2,
    //不要使用with语句
    'no-with': 2,
    //在某些场景只能使用一个var来申明变量
    'one-var': [
      2,
      {
        initialized: 'never'
      }
    ],
    //在进行断行时，操作符应该放在行首还是行尾。并且还可以对某些操作符进行重写。
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    'padded-blocks': [2, 'never'],
    //使用单引号 还是 双引号
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    //是否加分号
    semi: [2, 'never'],
    //该规则规定了分号前后的空格
    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    //代码块前面需要加空格
    'space-before-blocks': [2, 'always'],
    //函数圆括号前面需要是否加空格
    'space-before-function-paren': [
      2,
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    //圆括号内部不需要加空格
    'space-in-parens': [2, 'never'],
    //操作符前后需要加空格
    'space-infix-ops': 2,
    //一元操作符前后是否需要加空格，单词类操作符需要加，而非单词类操作符不用加
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      }
    ],
    //评论符号｀／*｀ ｀／／｀，后面需要留一个空格
    'spaced-comment': [
      0,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }
    ],
    //强制模板字符串中空格的使用
    'template-curly-spacing': [2, 'never'],
    //推荐使用isNaN方法，而不要直接和NaN作比较
    'use-isnan': 2,
    //在使用typeof操作符时，作比较的字符串必须是合法字符串eg:'string' 'object'
    'valid-typeof': 2,
    //立即执行函数需要用圆括号包围
    'wrap-iife': [1, 'any'],
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'],
    // 首选const
    'prefer-const': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    //大括号内是否允许不必要的空格
    'object-curly-spacing': [
      2,
      'always',
      {
        objectsInObjects: true
      }
    ],
    // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之后和 ] 之前不能带空格，always参数：[ 之后和 ] 之前必须带空格
    'array-bracket-spacing': [2, 'never']
  }
}
