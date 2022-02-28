/* PrismJS 1.25.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+http+java+js-extras+pug+pure+python+r+jsx+tsx+ruby+rust+sass+scss+sql+typescript&plugins=line-numbers+toolbar+copy-to-clipboard */
var _self =
    'undefined' != typeof window
      ? window
      : 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function(u) {
    var t = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
      n = 0,
      e = {},
      M = {
        manual: u.Prism && u.Prism.manual,
        disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof W
              ? new W(n.type, e(n.content), n.alias)
              : Array.isArray(n)
              ? n.map(e)
              : n
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/\u00a0/g, ' ')
          },
          type: function(e) {
            return Object.prototype.toString.call(e).slice(8, -1)
          },
          objId: function(e) {
            return e.__id || Object.defineProperty(e, '__id', { value: ++n }), e.__id
          },
          clone: function t(e, r) {
            var a, n
            switch (((r = r || {}), M.util.type(e))) {
              case 'Object':
                if (((n = M.util.objId(e)), r[n])) return r[n]
                for (var i in ((a = {}), (r[n] = a), e)) e.hasOwnProperty(i) && (a[i] = t(e[i], r))
                return a
              case 'Array':
                return (
                  (n = M.util.objId(e)),
                  r[n]
                    ? r[n]
                    : ((a = []),
                      (r[n] = a),
                      e.forEach(function(e, n) {
                        a[n] = t(e, r)
                      }),
                      a)
                )
              default:
                return e
            }
          },
          getLanguage: function(e) {
            for (; e; ) {
              var n = t.exec(e.className)
              if (n) return n[1].toLowerCase()
              e = e.parentElement
            }
            return 'none'
          },
          setLanguage: function(e, n) {
            ;(e.className = e.className.replace(RegExp(t, 'gi'), '')), e.classList.add('language-' + n)
          },
          currentScript: function() {
            if ('undefined' == typeof document) return null
            if ('currentScript' in document) return document.currentScript
            try {
              throw new Error()
            } catch (e) {
              var n = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(e.stack) || [])[1]
              if (n) {
                var t = document.getElementsByTagName('script')
                for (var r in t) if (t[r].src == n) return t[r]
              }
              return null
            }
          },
          isActive: function(e, n, t) {
            for (var r = 'no-' + n; e; ) {
              var a = e.classList
              if (a.contains(n)) return !0
              if (a.contains(r)) return !1
              e = e.parentElement
            }
            return !!t
          }
        },
        languages: {
          plain: e,
          plaintext: e,
          text: e,
          txt: e,
          extend: function(e, n) {
            var t = M.util.clone(M.languages[e])
            for (var r in n) t[r] = n[r]
            return t
          },
          insertBefore: function(t, e, n, r) {
            var a = (r = r || M.languages)[t],
              i = {}
            for (var l in a)
              if (a.hasOwnProperty(l)) {
                if (l == e) for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o])
                n.hasOwnProperty(l) || (i[l] = a[l])
              }
            var s = r[t]
            return (
              (r[t] = i),
              M.languages.DFS(M.languages, function(e, n) {
                n === s && e != t && (this[e] = i)
              }),
              i
            )
          },
          DFS: function e(n, t, r, a) {
            a = a || {}
            var i = M.util.objId
            for (var l in n)
              if (n.hasOwnProperty(l)) {
                t.call(n, l, n[l], r || l)
                var o = n[l],
                  s = M.util.type(o)
                'Object' !== s || a[i(o)]
                  ? 'Array' !== s || a[i(o)] || ((a[i(o)] = !0), e(o, t, l, a))
                  : ((a[i(o)] = !0), e(o, t, null, a))
              }
          }
        },
        plugins: {},
        highlightAll: function(e, n) {
          M.highlightAllUnder(document, e, n)
        },
        highlightAllUnder: function(e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          }
          M.hooks.run('before-highlightall', r),
            (r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector))),
            M.hooks.run('before-all-elements-highlight', r)
          for (var a, i = 0; (a = r.elements[i++]); ) M.highlightElement(a, !0 === n, r.callback)
        },
        highlightElement: function(e, n, t) {
          var r = M.util.getLanguage(e),
            a = M.languages[r]
          M.util.setLanguage(e, r)
          var i = e.parentElement
          i && 'pre' === i.nodeName.toLowerCase() && M.util.setLanguage(i, r)
          var l = { element: e, language: r, grammar: a, code: e.textContent }
          function o(e) {
            ;(l.highlightedCode = e),
              M.hooks.run('before-insert', l),
              (l.element.innerHTML = l.highlightedCode),
              M.hooks.run('after-highlight', l),
              M.hooks.run('complete', l),
              t && t.call(l.element)
          }
          if (
            (M.hooks.run('before-sanity-check', l),
            (i = l.element.parentElement) &&
              'pre' === i.nodeName.toLowerCase() &&
              !i.hasAttribute('tabindex') &&
              i.setAttribute('tabindex', '0'),
            !l.code)
          )
            return M.hooks.run('complete', l), void (t && t.call(l.element))
          if ((M.hooks.run('before-highlight', l), l.grammar))
            if (n && u.Worker) {
              var s = new Worker(M.filename)
              ;(s.onmessage = function(e) {
                o(e.data)
              }),
                s.postMessage(JSON.stringify({ language: l.language, code: l.code, immediateClose: !0 }))
            } else o(M.highlight(l.code, l.grammar, l.language))
          else o(M.util.encode(l.code))
        },
        highlight: function(e, n, t) {
          var r = { code: e, grammar: n, language: t }
          return (
            M.hooks.run('before-tokenize', r),
            (r.tokens = M.tokenize(r.code, r.grammar)),
            M.hooks.run('after-tokenize', r),
            W.stringify(M.util.encode(r.tokens), r.language)
          )
        },
        tokenize: function(e, n) {
          var t = n.rest
          if (t) {
            for (var r in t) n[r] = t[r]
            delete n.rest
          }
          var a = new i()
          return (
            I(a, a.head, e),
            (function e(n, t, r, a, i, l) {
              for (var o in r)
                if (r.hasOwnProperty(o) && r[o]) {
                  var s = r[o]
                  s = Array.isArray(s) ? s : [s]
                  for (var u = 0; u < s.length; ++u) {
                    if (l && l.cause == o + ',' + u) return
                    var c = s[u],
                      g = c.inside,
                      f = !!c.lookbehind,
                      h = !!c.greedy,
                      d = c.alias
                    if (h && !c.pattern.global) {
                      var v = c.pattern.toString().match(/[imsuy]*$/)[0]
                      c.pattern = RegExp(c.pattern.source, v + 'g')
                    }
                    for (
                      var p = c.pattern || c, m = a.next, y = i;
                      m !== t.tail && !(l && y >= l.reach);
                      y += m.value.length, m = m.next
                    ) {
                      var k = m.value
                      if (t.length > n.length) return
                      if (!(k instanceof W)) {
                        var x,
                          b = 1
                        if (h) {
                          if (!(x = z(p, y, n, f)) || x.index >= n.length) break
                          var w = x.index,
                            A = x.index + x[0].length,
                            P = y
                          for (P += m.value.length; P <= w; ) (m = m.next), (P += m.value.length)
                          if (((P -= m.value.length), (y = P), m.value instanceof W)) continue
                          for (var E = m; E !== t.tail && (P < A || 'string' == typeof E.value); E = E.next)
                            b++, (P += E.value.length)
                          b--, (k = n.slice(y, P)), (x.index -= y)
                        } else if (!(x = z(p, 0, k, f))) continue
                        var w = x.index,
                          L = x[0],
                          S = k.slice(0, w),
                          O = k.slice(w + L.length),
                          j = y + k.length
                        l && j > l.reach && (l.reach = j)
                        var C = m.prev
                        S && ((C = I(t, C, S)), (y += S.length)), q(t, C, b)
                        var N = new W(o, g ? M.tokenize(L, g) : L, d, L)
                        if (((m = I(t, C, N)), O && I(t, m, O), 1 < b)) {
                          var _ = { cause: o + ',' + u, reach: j }
                          e(n, t, r, m.prev, y, _), l && _.reach > l.reach && (l.reach = _.reach)
                        }
                      }
                    }
                  }
                }
            })(e, a, n, a.head, 0),
            (function(e) {
              var n = [],
                t = e.head.next
              for (; t !== e.tail; ) n.push(t.value), (t = t.next)
              return n
            })(a)
          )
        },
        hooks: {
          all: {},
          add: function(e, n) {
            var t = M.hooks.all
            ;(t[e] = t[e] || []), t[e].push(n)
          },
          run: function(e, n) {
            var t = M.hooks.all[e]
            if (t && t.length) for (var r, a = 0; (r = t[a++]); ) r(n)
          }
        },
        Token: W
      }
    function W(e, n, t, r) {
      ;(this.type = e), (this.content = n), (this.alias = t), (this.length = 0 | (r || '').length)
    }
    function z(e, n, t, r) {
      e.lastIndex = n
      var a = e.exec(t)
      if (a && r && a[1]) {
        var i = a[1].length
        ;(a.index += i), (a[0] = a[0].slice(i))
      }
      return a
    }
    function i() {
      var e = { value: null, prev: null, next: null },
        n = { value: null, prev: e, next: null }
      ;(e.next = n), (this.head = e), (this.tail = n), (this.length = 0)
    }
    function I(e, n, t) {
      var r = n.next,
        a = { value: t, prev: n, next: r }
      return (n.next = a), (r.prev = a), e.length++, a
    }
    function q(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next
      ;((n.next = r).prev = n), (e.length -= a)
    }
    if (
      ((u.Prism = M),
      (W.stringify = function n(e, t) {
        if ('string' == typeof e) return e
        if (Array.isArray(e)) {
          var r = ''
          return (
            e.forEach(function(e) {
              r += n(e, t)
            }),
            r
          )
        }
        var a = {
            type: e.type,
            content: n(e.content, t),
            tag: 'span',
            classes: ['token', e.type],
            attributes: {},
            language: t
          },
          i = e.alias
        i && (Array.isArray(i) ? Array.prototype.push.apply(a.classes, i) : a.classes.push(i)), M.hooks.run('wrap', a)
        var l = ''
        for (var o in a.attributes) l += ' ' + o + '="' + (a.attributes[o] || '').replace(/"/g, '&quot;') + '"'
        return '<' + a.tag + ' class="' + a.classes.join(' ') + '"' + l + '>' + a.content + '</' + a.tag + '>'
      }),
      !u.document)
    )
      return (
        u.addEventListener &&
          (M.disableWorkerMessageHandler ||
            u.addEventListener(
              'message',
              function(e) {
                var n = JSON.parse(e.data),
                  t = n.language,
                  r = n.code,
                  a = n.immediateClose
                u.postMessage(M.highlight(r, M.languages[t], t)), a && u.close()
              },
              !1
            )),
        M
      )
    var r = M.util.currentScript()
    function a() {
      M.manual || M.highlightAll()
    }
    if ((r && ((M.filename = r.src), r.hasAttribute('data-manual') && (M.manual = !0)), !M.manual)) {
      var l = document.readyState
      'loading' === l || ('interactive' === l && r && r.defer)
        ? document.addEventListener('DOMContentLoaded', a)
        : window.requestAnimationFrame
        ? window.requestAnimationFrame(a)
        : window.setTimeout(a, 16)
    }
    return M
  })(_self)
'undefined' != typeof module && module.exports && (module.exports = Prism),
  'undefined' != typeof global && (global.Prism = Prism)
;(Prism.languages.markup = {
  comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
  prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
  doctype: {
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      'internal-subset': { pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/, lookbehind: !0, greedy: !0, inside: null },
      string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
      punctuation: /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/i,
      name: /[^\s<>'"]+/
    }
  },
  cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: { pattern: /^<\/?[^\s>\/]+/, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: { punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/] }
      },
      punctuation: /\/?>/,
      'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } }
    }
  },
  entity: [{ pattern: /&[\da-z]{1,8};/i, alias: 'named-entity' }, /&#x?[\da-f]{1,8};/i]
}),
  (Prism.languages.markup.tag.inside['attr-value'].inside.entity = Prism.languages.markup.entity),
  (Prism.languages.markup.doctype.inside['internal-subset'].inside = Prism.languages.markup),
  Prism.hooks.add('wrap', function(a) {
    'entity' === a.type && (a.attributes.title = a.content.replace(/&amp;/, '&'))
  }),
  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    value: function(a, e) {
      var s = {}
      ;(s['language-' + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e]
      }),
        (s.cdata = /^<!\[CDATA\[|\]\]>$/i)
      var t = { 'included-cdata': { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s } }
      t['language-' + e] = { pattern: /[\s\S]+/, inside: Prism.languages[e] }
      var n = {}
      ;(n[a] = {
        pattern: RegExp(
          '(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)'.replace(
            /__/g,
            function() {
              return a
            }
          ),
          'i'
        ),
        lookbehind: !0,
        greedy: !0,
        inside: t
      }),
        Prism.languages.insertBefore('markup', 'cdata', n)
    }
  }),
  Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    value: function(a, e) {
      Prism.languages.markup.tag.inside['special-attr'].push({
        pattern: RegExp('(^|["\'\\s])(?:' + a + ')\\s*=\\s*(?:"[^"]*"|\'[^\']*\'|[^\\s\'">=]+(?=[\\s>]))', 'i'),
        lookbehind: !0,
        inside: {
          'attr-name': /^[^\s=]+/,
          'attr-value': {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [e, 'language-' + e],
                inside: Prism.languages[e]
              },
              punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/]
            }
          }
        }
      })
    }
  }),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (Prism.languages.xml = Prism.languages.extend('markup', {})),
  (Prism.languages.ssml = Prism.languages.xml),
  (Prism.languages.atom = Prism.languages.xml),
  (Prism.languages.rss = Prism.languages.xml)
!(function(s) {
  var e = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/
  ;(s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
      inside: {
        rule: /^@[\w-]+/,
        'selector-function-argument': {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: !0,
          alias: 'selector'
        },
        keyword: { pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/, lookbehind: !0 }
      }
    },
    url: {
      pattern: RegExp('\\burl\\((?:' + e.source + '|(?:[^\\\\\r\n()"\']|\\\\[^])*)\\)', 'i'),
      greedy: !0,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: { pattern: RegExp('^' + e.source + '$'), alias: 'url' }
      }
    },
    selector: {
      pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + e.source + ')*(?=\\s*\\{)'),
      lookbehind: !0
    },
    string: { pattern: e, greedy: !0 },
    property: {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: !0
    },
    important: /!important\b/i,
    function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
    punctuation: /[(){};:,]/
  }),
    (s.languages.css.atrule.inside.rest = s.languages.css)
  var t = s.languages.markup
  t && (t.tag.addInlined('style', 'css'), t.tag.addAttribute('style', 'css'))
})(Prism)
Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 }
  ],
  string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
  'class-name': {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ }
  },
  keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
}
;(Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [
    Prism.languages.clike['class-name'],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: !0
    }
  ],
  keyword: [
    { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0
    }
  ],
  function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: RegExp(
      '(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])'
    ),
    lookbehind: !0
  },
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
})),
  (Prism.languages.javascript[
    'class-name'
  ][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        'regex-source': {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: 'language-regex',
          inside: Prism.languages.regex
        },
        'regex-delimiter': /^\/|\/$/,
        'regex-flags': /^[a-z]+$/
      }
    },
    'function-variable': {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: 'function'
    },
    parameter: [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
      }
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  }),
  Prism.languages.insertBefore('javascript', 'string', {
    hashbang: { pattern: /^#!.*/, greedy: !0, alias: 'comment' },
    'template-string': {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            'interpolation-punctuation': { pattern: /^\$\{|\}$/, alias: 'punctuation' },
            rest: Prism.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    },
    'string-property': {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: 'property'
    }
  }),
  Prism.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: 'property'
    }
  }),
  Prism.languages.markup &&
    (Prism.languages.markup.tag.addInlined('script', 'javascript'),
    Prism.languages.markup.tag.addAttribute(
      'on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)',
      'javascript'
    )),
  (Prism.languages.js = Prism.languages.javascript)
!(function(t) {
  t.languages.http = {
    'request-line': {
      pattern: /^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*\sHTTP\/[\d.]+/m,
      inside: {
        method: { pattern: /^[A-Z]+\b/, alias: 'property' },
        'request-target': {
          pattern: /^(\s)(?:https?:\/\/|\/)\S*(?=\s)/,
          lookbehind: !0,
          alias: 'url',
          inside: t.languages.uri
        },
        'http-version': { pattern: /^(\s)HTTP\/[\d.]+/, lookbehind: !0, alias: 'property' }
      }
    },
    'response-status': {
      pattern: /^HTTP\/[\d.]+ \d+ .+/m,
      inside: {
        'http-version': { pattern: /^HTTP\/[\d.]+/, alias: 'property' },
        'status-code': { pattern: /^(\s)\d+(?=\s)/, lookbehind: !0, alias: 'number' },
        'reason-phrase': { pattern: /^(\s).+/, lookbehind: !0, alias: 'string' }
      }
    },
    'header-name': { pattern: /^[\w-]+:(?=.)/m, alias: 'keyword' }
  }
  var a,
    e,
    n,
    s = t.languages,
    i = {
      'application/javascript': s.javascript,
      'application/json': s.json || s.javascript,
      'application/xml': s.xml,
      'text/xml': s.xml,
      'text/html': s.html,
      'text/css': s.css
    },
    r = { 'application/json': !0, 'application/xml': !0 }
  for (var p in i)
    if (i[p]) {
      a = a || {}
      var o = r[p]
        ? (void 0, (n = (e = p).replace(/^[a-z]+\//, '')), '(?:' + e + '|\\w+/(?:[\\w.-]+\\+)+' + n + '(?![+\\w.-]))')
        : p
      a[p.replace(/\//g, '-')] = {
        pattern: RegExp('(content-type:\\s*' + o + '(?:(?:\r\n?|\n)[\\w-].*)*(?:\r(?:\n|(?!\n))|\n))[^\\w-][^]*', 'i'),
        lookbehind: !0,
        inside: i[p]
      }
    }
  a && t.languages.insertBefore('http', 'header-name', a)
})(Prism)
!(function(e) {
  var t = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    n = '(^|[^\\w.])(?:[a-z]\\w*\\s*\\.\\s*)*(?:[A-Z]\\w*\\s*\\.\\s*)*',
    a = {
      pattern: RegExp(n + '[A-Z](?:[\\d_A-Z]*[a-z]\\w*)?\\b'),
      lookbehind: !0,
      inside: {
        namespace: { pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/, inside: { punctuation: /\./ } },
        punctuation: /\./
      }
    }
  ;(e.languages.java = e.languages.extend('clike', {
    'class-name': [a, { pattern: RegExp(n + '[A-Z]\\w*(?=\\s+\\w+\\s*[;,=()])'), lookbehind: !0, inside: a.inside }],
    keyword: t,
    function: [e.languages.clike.function, { pattern: /(::\s*)[a-z_]\w*/, lookbehind: !0 }],
    number: /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: { pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m, lookbehind: !0 }
  })),
    e.languages.insertBefore('java', 'string', {
      'triple-quoted-string': { pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/, greedy: !0, alias: 'string' }
    }),
    e.languages.insertBefore('java', 'class-name', {
      annotation: { pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/, lookbehind: !0, alias: 'punctuation' },
      generics: {
        pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
        inside: { 'class-name': a, keyword: t, punctuation: /[<>(),.:]/, operator: /[?&|]/ }
      },
      namespace: {
        pattern: RegExp(
          '(\\b(?:exports|import(?:\\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\\s+)(?!<keyword>)[a-z]\\w*(?:\\.[a-z]\\w*)*\\.?'.replace(
            /<keyword>/g,
            function() {
              return t.source
            }
          )
        ),
        lookbehind: !0,
        inside: { punctuation: /\./ }
      }
    })
})(Prism)
!(function(a) {
  function e(a, e) {
    return RegExp(
      a.replace(/<ID>/g, function() {
        return '(?!\\s)[_$a-zA-Z\\xA0-\\uFFFF](?:(?!\\s)[$\\w\\xA0-\\uFFFF])*'
      }),
      e
    )
  }
  a.languages.insertBefore('javascript', 'function-variable', {
    'method-variable': {
      pattern: RegExp('(\\.\\s*)' + a.languages.javascript['function-variable'].pattern.source),
      lookbehind: !0,
      alias: ['function-variable', 'method', 'function', 'property-access']
    }
  }),
    a.languages.insertBefore('javascript', 'function', {
      method: {
        pattern: RegExp('(\\.\\s*)' + a.languages.javascript.function.source),
        lookbehind: !0,
        alias: ['function', 'property-access']
      }
    }),
    a.languages.insertBefore('javascript', 'constant', {
      'known-class-name': [
        {
          pattern: /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
          alias: 'class-name'
        },
        { pattern: /\b(?:[A-Z]\w*)Error\b/, alias: 'class-name' }
      ]
    }),
    a.languages.insertBefore('javascript', 'keyword', {
      imports: {
        pattern: e(
          '(\\bimport\\b\\s*)(?:<ID>(?:\\s*,\\s*(?:\\*\\s*as\\s+<ID>|\\{[^{}]*\\}))?|\\*\\s*as\\s+<ID>|\\{[^{}]*\\})(?=\\s*\\bfrom\\b)'
        ),
        lookbehind: !0,
        inside: a.languages.javascript
      },
      exports: {
        pattern: e('(\\bexport\\b\\s*)(?:\\*(?:\\s*as\\s+<ID>)?(?=\\s*\\bfrom\\b)|\\{[^{}]*\\})'),
        lookbehind: !0,
        inside: a.languages.javascript
      }
    }),
    a.languages.javascript.keyword.unshift(
      { pattern: /\b(?:as|default|export|from|import)\b/, alias: 'module' },
      {
        pattern: /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
        alias: 'control-flow'
      },
      { pattern: /\bnull\b/, alias: ['null', 'nil'] },
      { pattern: /\bundefined\b/, alias: 'nil' }
    ),
    a.languages.insertBefore('javascript', 'operator', {
      spread: { pattern: /\.{3}/, alias: 'operator' },
      arrow: { pattern: /=>/, alias: 'operator' }
    }),
    a.languages.insertBefore('javascript', 'punctuation', {
      'property-access': { pattern: e('(\\.\\s*)#?<ID>'), lookbehind: !0 },
      'maybe-class-name': { pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/, lookbehind: !0 },
      dom: {
        pattern: /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
        alias: 'variable'
      },
      console: { pattern: /\bconsole(?=\s*\.)/, alias: 'class-name' }
    })
  for (
    var t = ['function', 'function-variable', 'method', 'method-variable', 'property-access'], r = 0;
    r < t.length;
    r++
  ) {
    var n = t[r],
      s = a.languages.javascript[n]
    'RegExp' === a.util.type(s) && (s = a.languages.javascript[n] = { pattern: s })
    var o = s.inside || {}
    ;(s.inside = o)['maybe-class-name'] = /^[A-Z][\s\S]*/
  }
})(Prism)
!(function(e) {
  e.languages.pug = {
    comment: { pattern: /(^([\t ]*))\/\/.*(?:(?:\r?\n|\r)\2[\t ].+)*/m, lookbehind: !0 },
    'multiline-script': {
      pattern: /(^([\t ]*)script\b.*\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
      lookbehind: !0,
      inside: e.languages.javascript
    },
    filter: {
      pattern: /(^([\t ]*)):.+(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
      lookbehind: !0,
      inside: { 'filter-name': { pattern: /^:[\w-]+/, alias: 'variable' } }
    },
    'multiline-plain-text': {
      pattern: /(^([\t ]*)[\w\-#.]+\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
      lookbehind: !0
    },
    markup: { pattern: /(^[\t ]*)<.+/m, lookbehind: !0, inside: e.languages.markup },
    doctype: { pattern: /((?:^|\n)[\t ]*)doctype(?: .+)?/, lookbehind: !0 },
    'flow-control': {
      pattern: /(^[\t ]*)(?:case|default|each|else|if|unless|when|while)\b(?: .+)?/m,
      lookbehind: !0,
      inside: {
        each: { pattern: /^each .+? in\b/, inside: { keyword: /\b(?:each|in)\b/, punctuation: /,/ } },
        branch: { pattern: /^(?:case|default|else|if|unless|when|while)\b/, alias: 'keyword' },
        rest: e.languages.javascript
      }
    },
    keyword: { pattern: /(^[\t ]*)(?:append|block|extends|include|prepend)\b.+/m, lookbehind: !0 },
    mixin: [
      {
        pattern: /(^[\t ]*)mixin .+/m,
        lookbehind: !0,
        inside: { keyword: /^mixin/, function: /\w+(?=\s*\(|\s*$)/, punctuation: /[(),.]/ }
      },
      {
        pattern: /(^[\t ]*)\+.+/m,
        lookbehind: !0,
        inside: { name: { pattern: /^\+\w+/, alias: 'function' }, rest: e.languages.javascript }
      }
    ],
    script: {
      pattern: /(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]).+/m,
      lookbehind: !0,
      inside: e.languages.javascript
    },
    'plain-text': { pattern: /(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]).+/m, lookbehind: !0 },
    tag: {
      pattern: /(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,
      lookbehind: !0,
      inside: {
        attributes: [
          { pattern: /&[^(]+\([^)]+\)/, inside: e.languages.javascript },
          {
            pattern: /\([^)]+\)/,
            inside: {
              'attr-value': {
                pattern: /(=\s*(?!\s))(?:\{[^}]*\}|[^,)\r\n]+)/,
                lookbehind: !0,
                inside: e.languages.javascript
              },
              'attr-name': /[\w-]+(?=\s*!?=|\s*[,)])/,
              punctuation: /[!=(),]+/
            }
          }
        ],
        punctuation: /:/,
        'attr-id': /#[\w\-]+/,
        'attr-class': /\.[\w\-]+/
      }
    },
    code: [{ pattern: /(^[\t ]*(?:-|!?=)).+/m, lookbehind: !0, inside: e.languages.javascript }],
    punctuation: /[.\-!=|]+/
  }
  for (
    var t = [
        { filter: 'atpl', language: 'twig' },
        { filter: 'coffee', language: 'coffeescript' },
        'ejs',
        'handlebars',
        'less',
        'livescript',
        'markdown',
        { filter: 'sass', language: 'scss' },
        'stylus'
      ],
      n = {},
      a = 0,
      i = t.length;
    a < i;
    a++
  ) {
    var r = t[a]
    ;(r = 'string' == typeof r ? { filter: r, language: r } : r),
      e.languages[r.language] &&
        (n['filter-' + r.filter] = {
          pattern: RegExp(
            '(^([\t ]*)):<filter_name>(?:(?:\r?\n|\r(?!\n))(?:\\2[\t ].+|\\s*?(?=\r?\n|\r)))+'.replace(
              '<filter_name>',
              function() {
                return r.filter
              }
            ),
            'm'
          ),
          lookbehind: !0,
          inside: { 'filter-name': { pattern: /^:[\w-]+/, alias: 'variable' }, rest: e.languages[r.language] }
        })
  }
  e.languages.insertBefore('pug', 'filter', n)
})(Prism)
!(function(r) {
  r.languages.pure = {
    comment: [
      { pattern: /(^|[^\\])\/\*[\s\S]*?\*\//, lookbehind: !0 },
      { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0 },
      /#!.+/
    ],
    'inline-lang': {
      pattern: /%<[\s\S]+?%>/,
      greedy: !0,
      inside: {
        lang: { pattern: /(^%< *)-\*-.+?-\*-/, lookbehind: !0, alias: 'comment' },
        delimiter: { pattern: /^%<.*|%>$/, alias: 'punctuation' }
      }
    },
    string: { pattern: /"(?:\\.|[^"\\\r\n])*"/, greedy: !0 },
    number: {
      pattern: /((?:\.\.)?)(?:\b(?:inf|nan)\b|\b0x[\da-f]+|(?:\b(?:0b)?\d+(?:\.\d+)?|\B\.\d+)(?:e[+-]?\d+)?L?)/i,
      lookbehind: !0
    },
    keyword: /\b(?:NULL|ans|break|bt|case|catch|cd|clear|const|def|del|dump|else|end|exit|extern|false|force|help|if|infix[lr]?|interface|let|ls|mem|namespace|nonfix|of|otherwise|outfix|override|postfix|prefix|private|public|pwd|quit|run|save|show|stats|then|throw|trace|true|type|underride|using|when|with)\b/,
    function: /\b(?:abs|add_(?:addr|constdef|(?:fundef|interface|macdef|typedef)(?:_at)?|vardef)|all|any|applp?|arity|bigintp?|blob(?:_crc|_size|p)?|boolp?|byte_c?string(?:_pointer)?|byte_(?:matrix|pointer)|calloc|cat|catmap|ceil|char[ps]?|check_ptrtag|chr|clear_sentry|clearsym|closurep?|cmatrixp?|cols?|colcat(?:map)?|colmap|colrev|colvector(?:p|seq)?|complex(?:_float_(?:matrix|pointer)|_matrix(?:_view)?|_pointer|p)?|conj|cookedp?|cst|cstring(?:_(?:dup|list|vector))?|curry3?|cyclen?|del_(?:constdef|fundef|interface|macdef|typedef|vardef)|delete|diag(?:mat)?|dim|dmatrixp?|do|double(?:_matrix(?:_view)?|_pointer|p)?|dowith3?|drop|dropwhile|eval(?:cmd)?|exactp|filter|fix|fixity|flip|float(?:_matrix|_pointer)|floor|fold[lr]1?|frac|free|funp?|functionp?|gcd|get(?:_(?:byte|constdef|double|float|fundef|int(?:64)?|interface(?:_typedef)?|long|macdef|pointer|ptrtag|sentry|short|string|typedef|vardef))?|globsym|hash|head|id|im|imatrixp?|index|inexactp|infp|init|insert|int(?:_matrix(?:_view)?|_pointer|p)?|int64_(?:matrix|pointer)|integerp?|iteraten?|iterwhile|join|keys?|lambdap?|last(?:err(?:pos)?)?|lcd|list[2p]?|listmap|make_ptrtag|malloc|map|matcat|matrixp?|max|member|min|nanp|nargs|nmatrixp?|null|numberp?|ord|pack(?:ed)?|pointer(?:_cast|_tag|_type|p)?|pow|pred|ptrtag|put(?:_(?:byte|double|float|int(?:64)?|long|pointer|short|string))?|rationalp?|re|realp?|realloc|recordp?|redim|reduce(?:_with)?|refp?|repeatn?|reverse|rlistp?|round|rows?|rowcat(?:map)?|rowmap|rowrev|rowvector(?:p|seq)?|same|scan[lr]1?|sentry|sgn|short_(?:matrix|pointer)|slice|smatrixp?|sort|split|str|strcat|stream|stride|string(?:_(?:dup|list|vector)|p)?|subdiag(?:mat)?|submat|subseq2?|substr|succ|supdiag(?:mat)?|symbolp?|tail|take|takewhile|thunkp?|transpose|trunc|tuplep?|typep|ubyte|uint(?:64)?|ulong|uncurry3?|unref|unzip3?|update|ushort|vals?|varp?|vector(?:p|seq)?|void|zip3?|zipwith3?)\b/,
    special: { pattern: /\b__[a-z]+__\b/i, alias: 'builtin' },
    operator: /(?:[!"#$%&'*+,\-.\/:<=>?@\\^`|~\u00a1-\u00bf\u00d7-\u00f7\u20d0-\u2bff]|\b_+\b)+|\b(?:and|div|mod|not|or)\b/,
    punctuation: /[(){}\[\];,|]/
  }
  ;['c', { lang: 'c++', alias: 'cpp' }, 'fortran'].forEach(function(e) {
    var t = e
    if (('string' != typeof e && ((t = e.alias), (e = e.lang)), r.languages[t])) {
      var a = {}
      ;(a['inline-lang-' + t] = {
        pattern: RegExp(
          '%< *-\\*- *<lang>\\d* *-\\*-[^]+?%>'.replace('<lang>', e.replace(/([.+*?\/\\(){}\[\]])/g, '\\$1')),
          'i'
        ),
        inside: r.util.clone(r.languages.pure['inline-lang'].inside)
      }),
        (a['inline-lang-' + t].inside.rest = r.util.clone(r.languages[t])),
        r.languages.insertBefore('pure', 'inline-lang', a)
    }
  }),
    r.languages.c && (r.languages.pure['inline-lang'].inside.rest = r.util.clone(r.languages.c))
})(Prism)
;(Prism.languages.python = {
  comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0 },
  'string-interpolation': {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: !0,
        inside: {
          'format-spec': { pattern: /(:)[^:(){}]+(?=\}$)/, lookbehind: !0 },
          'conversion-option': { pattern: /![sra](?=[:}]$)/, alias: 'punctuation' },
          rest: null
        }
      },
      string: /[\s\S]+/
    }
  },
  'triple-quoted-string': { pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i, greedy: !0, alias: 'string' },
  string: { pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i, greedy: !0 },
  function: { pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g, lookbehind: !0 },
  'class-name': { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
  decorator: {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
    lookbehind: !0,
    alias: ['annotation', 'punctuation'],
    inside: { punctuation: /\./ }
  },
  keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  boolean: /\b(?:False|None|True)\b/,
  number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  punctuation: /[{}[\];(),.:]/
}),
  (Prism.languages.python['string-interpolation'].inside.interpolation.inside.rest = Prism.languages.python),
  (Prism.languages.py = Prism.languages.python)
Prism.languages.r = {
  comment: /#.*/,
  string: { pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
  'percent-operator': { pattern: /%[^%\s]*%/, alias: 'operator' },
  boolean: /\b(?:FALSE|TRUE)\b/,
  ellipsis: /\.\.(?:\.|\d+)/,
  number: [/\b(?:Inf|NaN)\b/, /(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+(?:\.\d*)?|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/],
  keyword: /\b(?:NA|NA_character_|NA_complex_|NA_integer_|NA_real_|NULL|break|else|for|function|if|in|next|repeat|while)\b/,
  operator: /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
  punctuation: /[(){}\[\],;]/
}
!(function(o) {
  var t = o.util.clone(o.languages.javascript),
    e = '(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})'
  function n(t, n) {
    return (
      (t = t
        .replace(/<S>/g, function() {
          return '(?:\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))\\*/)'
        })
        .replace(/<BRACES>/g, function() {
          return '(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})'
        })
        .replace(/<SPREAD>/g, function() {
          return e
        })),
      RegExp(t, n)
    )
  }
  ;(e = n(e).source),
    (o.languages.jsx = o.languages.extend('markup', t)),
    (o.languages.jsx.tag.pattern = n(
      '</?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:"(?:\\\\[^]|[^\\\\"])*"|\'(?:\\\\[^]|[^\\\\\'])*\'|[^\\s{\'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*/?)?>'
    )),
    (o.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/),
    (o.languages.jsx.tag.inside[
      'attr-value'
    ].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/),
    (o.languages.jsx.tag.inside.tag.inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
    (o.languages.jsx.tag.inside.comment = t.comment),
    o.languages.insertBefore(
      'inside',
      'attr-name',
      { spread: { pattern: n('<SPREAD>'), inside: o.languages.jsx } },
      o.languages.jsx.tag
    ),
    o.languages.insertBefore(
      'inside',
      'special-attr',
      {
        script: {
          pattern: n('=<BRACES>'),
          inside: { 'script-punctuation': { pattern: /^=(?=\{)/, alias: 'punctuation' }, rest: o.languages.jsx },
          alias: 'language-javascript'
        }
      },
      o.languages.jsx.tag
    )
  var i = function(t) {
      return t ? ('string' == typeof t ? t : 'string' == typeof t.content ? t.content : t.content.map(i).join('')) : ''
    },
    r = function(t) {
      for (var n = [], e = 0; e < t.length; e++) {
        var a = t[e],
          s = !1
        if (
          ('string' != typeof a &&
            ('tag' === a.type && a.content[0] && 'tag' === a.content[0].type
              ? '</' === a.content[0].content[0].content
                ? 0 < n.length && n[n.length - 1].tagName === i(a.content[0].content[1]) && n.pop()
                : '/>' === a.content[a.content.length - 1].content ||
                  n.push({ tagName: i(a.content[0].content[1]), openedBraces: 0 })
              : 0 < n.length && 'punctuation' === a.type && '{' === a.content
              ? n[n.length - 1].openedBraces++
              : 0 < n.length && 0 < n[n.length - 1].openedBraces && 'punctuation' === a.type && '}' === a.content
              ? n[n.length - 1].openedBraces--
              : (s = !0)),
          (s || 'string' == typeof a) && 0 < n.length && 0 === n[n.length - 1].openedBraces)
        ) {
          var g = i(a)
          e < t.length - 1 &&
            ('string' == typeof t[e + 1] || 'plain-text' === t[e + 1].type) &&
            ((g += i(t[e + 1])), t.splice(e + 1, 1)),
            0 < e &&
              ('string' == typeof t[e - 1] || 'plain-text' === t[e - 1].type) &&
              ((g = i(t[e - 1]) + g), t.splice(e - 1, 1), e--),
            (t[e] = new o.Token('plain-text', g, null, g))
        }
        a.content && 'string' != typeof a.content && r(a.content)
      }
    }
  o.hooks.add('after-tokenize', function(t) {
    ;('jsx' !== t.language && 'tsx' !== t.language) || r(t.tokens)
  })
})(Prism)
!(function(e) {
  ;(e.languages.typescript = e.languages.extend('javascript', {
    'class-name': {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: !0,
      greedy: !0,
      inside: null
    },
    builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
  })),
    e.languages.typescript.keyword.push(
      /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
      /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
      /\btype\b(?=\s*(?:[\{*]|$))/
    ),
    delete e.languages.typescript.parameter,
    delete e.languages.typescript['literal-property']
  var s = e.languages.extend('typescript', {})
  delete s['class-name'],
    (e.languages.typescript['class-name'].inside = s),
    e.languages.insertBefore('typescript', 'function', {
      decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: { at: { pattern: /^@/, alias: 'operator' }, function: /^[\s\S]+/ }
      },
      'generic-function': {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: !0,
        inside: {
          function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
          generic: { pattern: /<[\s\S]+/, alias: 'class-name', inside: s }
        }
      }
    }),
    (e.languages.ts = e.languages.typescript)
})(Prism)
!(function(e) {
  var a = e.util.clone(e.languages.typescript)
  ;(e.languages.tsx = e.languages.extend('jsx', a)),
    delete e.languages.tsx.parameter,
    delete e.languages.tsx['literal-property']
  var t = e.languages.tsx.tag
  ;(t.pattern = RegExp('(^|[^\\w$]|(?=</))(?:' + t.pattern.source + ')', t.pattern.flags)), (t.lookbehind = !0)
})(Prism)
!(function(e) {
  e.languages.ruby = e.languages.extend('clike', {
    comment: [/#.*/, { pattern: /^=begin\s[\s\S]*?^=end/m, greedy: !0 }],
    'class-name': {
      pattern: /(\b(?:class)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ }
    },
    keyword: /\b(?:BEGIN|END|alias|and|begin|break|case|class|def|define_method|defined|do|each|else|elsif|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|private|protected|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/
  })
  var n = {
    pattern: /#\{[^}]+\}/,
    inside: { delimiter: { pattern: /^#\{|\}$/, alias: 'tag' }, rest: e.languages.ruby }
  }
  delete e.languages.ruby.function,
    e.languages.insertBefore('ruby', 'keyword', {
      regex: [
        {
          pattern: RegExp(
            '%r(?:' +
              [
                '([^a-zA-Z0-9\\s{(\\[<])(?:(?!\\1)[^\\\\]|\\\\[^])*\\1',
                '\\((?:[^()\\\\]|\\\\[^])*\\)',
                '\\{(?:[^#{}\\\\]|#(?:\\{[^}]+\\})?|\\\\[^])*\\}',
                '\\[(?:[^\\[\\]\\\\]|\\\\[^])*\\]',
                '<(?:[^<>\\\\]|\\\\[^])*>'
              ].join('|') +
              ')[egimnosux]{0,6}'
          ),
          greedy: !0,
          inside: { interpolation: n }
        },
        {
          pattern: /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[egimnosux]{0,6}(?=\s*(?:$|[\r\n,.;})#]))/,
          lookbehind: !0,
          greedy: !0,
          inside: { interpolation: n }
        }
      ],
      variable: /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
      symbol: { pattern: /(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/, lookbehind: !0 },
      'method-definition': {
        pattern: /(\bdef\s+)[\w.]+/,
        lookbehind: !0,
        inside: { function: /\w+$/, rest: e.languages.ruby }
      }
    }),
    e.languages.insertBefore('ruby', 'number', {
      builtin: /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Fixnum|Float|Hash|IO|Integer|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|Stat|String|Struct|Symbol|TMS|Thread|ThreadGroup|Time|TrueClass)\b/,
      constant: /\b[A-Z]\w*(?:[?!]|\b)/
    }),
    (e.languages.ruby.string = [
      {
        pattern: RegExp(
          '%[qQiIwWxs]?(?:' +
            [
              '([^a-zA-Z0-9\\s{(\\[<])(?:(?!\\1)[^\\\\]|\\\\[^])*\\1',
              '\\((?:[^()\\\\]|\\\\[^])*\\)',
              '\\{(?:[^#{}\\\\]|#(?:\\{[^}]+\\})?|\\\\[^])*\\}',
              '\\[(?:[^\\[\\]\\\\]|\\\\[^])*\\]',
              '<(?:[^<>\\\\]|\\\\[^])*>'
            ].join('|') +
            ')'
        ),
        greedy: !0,
        inside: { interpolation: n }
      },
      {
        pattern: /("|')(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|(?!\1)[^\\#\r\n])*\1/,
        greedy: !0,
        inside: { interpolation: n }
      },
      {
        pattern: /<<[-~]?([a-z_]\w*)[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
        alias: 'heredoc-string',
        greedy: !0,
        inside: {
          delimiter: { pattern: /^<<[-~]?[a-z_]\w*|[a-z_]\w*$/i, alias: 'symbol', inside: { punctuation: /^<<[-~]?/ } },
          interpolation: n
        }
      },
      {
        pattern: /<<[-~]?'([a-z_]\w*)'[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
        alias: 'heredoc-string',
        greedy: !0,
        inside: {
          delimiter: {
            pattern: /^<<[-~]?'[a-z_]\w*'|[a-z_]\w*$/i,
            alias: 'symbol',
            inside: { punctuation: /^<<[-~]?'|'$/ }
          }
        }
      }
    ]),
    (e.languages.rb = e.languages.ruby)
})(Prism)
!(function(e) {
  for (var a = '/\\*(?:[^*/]|\\*(?!/)|/(?!\\*)|<self>)*\\*/', t = 0; t < 2; t++)
    a = a.replace(/<self>/g, function() {
      return a
    })
  ;(a = a.replace(/<self>/g, function() {
    return '[^\\s\\S]'
  })),
    (e.languages.rust = {
      comment: [
        { pattern: RegExp('(^|[^\\\\])' + a), lookbehind: !0, greedy: !0 },
        { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 }
      ],
      string: { pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/, greedy: !0 },
      char: {
        pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
        greedy: !0,
        alias: 'string'
      },
      attribute: {
        pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
        greedy: !0,
        alias: 'attr-name',
        inside: { string: null }
      },
      'closure-params': {
        pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
        lookbehind: !0,
        greedy: !0,
        inside: { 'closure-punctuation': { pattern: /^\||\|$/, alias: 'punctuation' }, rest: null }
      },
      'lifetime-annotation': { pattern: /'\w+/, alias: 'symbol' },
      'fragment-specifier': { pattern: /(\$\w+:)[a-z]+/, lookbehind: !0, alias: 'punctuation' },
      variable: /\$\w+/,
      'function-definition': { pattern: /(\bfn\s+)\w+/, lookbehind: !0, alias: 'function' },
      'type-definition': { pattern: /(\b(?:enum|struct|union)\s+)\w+/, lookbehind: !0, alias: 'class-name' },
      'module-declaration': [
        { pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/, lookbehind: !0, alias: 'namespace' },
        {
          pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
          lookbehind: !0,
          alias: 'namespace',
          inside: { punctuation: /::/ }
        }
      ],
      keyword: [
        /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
        /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/
      ],
      function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
      macro: { pattern: /\b\w+!/, alias: 'property' },
      constant: /\b[A-Z_][A-Z_\d]+\b/,
      'class-name': /\b[A-Z]\w*\b/,
      namespace: {
        pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
        inside: { punctuation: /::/ }
      },
      number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
      boolean: /\b(?:false|true)\b/,
      punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
      operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
    }),
    (e.languages.rust['closure-params'].inside.rest = e.languages.rust),
    (e.languages.rust.attribute.inside.string = e.languages.rust.string)
})(Prism)
!(function(e) {
  ;(e.languages.sass = e.languages.extend('css', {
    comment: { pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t].+)*/m, lookbehind: !0, greedy: !0 }
  })),
    e.languages.insertBefore('sass', 'atrule', {
      'atrule-line': { pattern: /^(?:[ \t]*)[@+=].+/m, greedy: !0, inside: { atrule: /(?:@[\w-]+|[+=])/ } }
    }),
    delete e.languages.sass.atrule
  var r = /\$[-\w]+|#\{\$[-\w]+\}/,
    t = [/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|not|or)\b/, { pattern: /(\s)-(?=\s)/, lookbehind: !0 }]
  e.languages.insertBefore('sass', 'property', {
    'variable-line': { pattern: /^[ \t]*\$.+/m, greedy: !0, inside: { punctuation: /:/, variable: r, operator: t } },
    'property-line': {
      pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s].*)/m,
      greedy: !0,
      inside: {
        property: [/[^:\s]+(?=\s*:)/, { pattern: /(:)[^:\s]+/, lookbehind: !0 }],
        punctuation: /:/,
        variable: r,
        operator: t,
        important: e.languages.sass.important
      }
    }
  }),
    delete e.languages.sass.property,
    delete e.languages.sass.important,
    e.languages.insertBefore('sass', 'punctuation', {
      selector: {
        pattern: /^([ \t]*)\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*)*/m,
        lookbehind: !0,
        greedy: !0
      }
    })
})(Prism)
;(Prism.languages.scss = Prism.languages.extend('css', {
  comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/, lookbehind: !0 },
  atrule: { pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/, inside: { rule: /@[\w-]+/ } },
  url: /(?:[-a-z]+-)?url(?=\()/i,
  selector: {
    pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
    inside: { parent: { pattern: /&/, alias: 'important' }, placeholder: /%[-\w]+/, variable: /\$[-\w]+|#\{\$[-\w]+\}/ }
  },
  property: { pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/, inside: { variable: /\$[-\w]+|#\{\$[-\w]+\}/ } }
})),
  Prism.languages.insertBefore('scss', 'atrule', {
    keyword: [
      /@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i,
      { pattern: /( )(?:from|through)(?= )/, lookbehind: !0 }
    ]
  }),
  Prism.languages.insertBefore('scss', 'important', { variable: /\$[-\w]+|#\{\$[-\w]+\}/ }),
  Prism.languages.insertBefore('scss', 'function', {
    'module-modifier': { pattern: /\b(?:as|hide|show|with)\b/i, alias: 'keyword' },
    placeholder: { pattern: /%[-\w]+/, alias: 'selector' },
    statement: { pattern: /\B!(?:default|optional)\b/i, alias: 'keyword' },
    boolean: /\b(?:false|true)\b/,
    null: { pattern: /\bnull\b/, alias: 'keyword' },
    operator: { pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/, lookbehind: !0 }
  }),
  (Prism.languages.scss.atrule.inside.rest = Prism.languages.scss)
Prism.languages.sql = {
  comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/, lookbehind: !0 },
  variable: [{ pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/, greedy: !0 }, /@[\w.$]+/],
  string: { pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/, greedy: !0, lookbehind: !0 },
  identifier: {
    pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
    greedy: !0,
    lookbehind: !0,
    inside: { punctuation: /^`|`$/ }
  },
  function: /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
  keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
  number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
  operator: /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  punctuation: /[;[\]()`,.]/
}
!(function() {
  if ('undefined' != typeof Prism && 'undefined' != typeof document) {
    var o = 'line-numbers',
      a = /\n(?!$)/g,
      e = (Prism.plugins.lineNumbers = {
        getLine: function(e, n) {
          if ('PRE' === e.tagName && e.classList.contains(o)) {
            var t = e.querySelector('.line-numbers-rows')
            if (t) {
              var i = parseInt(e.getAttribute('data-start'), 10) || 1,
                r = i + (t.children.length - 1)
              n < i && (n = i), r < n && (n = r)
              var s = n - i
              return t.children[s]
            }
          }
        },
        resize: function(e) {
          u([e])
        },
        assumeViewportIndependence: !0
      }),
      n = void 0
    window.addEventListener('resize', function() {
      ;(e.assumeViewportIndependence && n === window.innerWidth) ||
        ((n = window.innerWidth), u(Array.prototype.slice.call(document.querySelectorAll('pre.' + o))))
    }),
      Prism.hooks.add('complete', function(e) {
        if (e.code) {
          var n = e.element,
            t = n.parentNode
          if (t && /pre/i.test(t.nodeName) && !n.querySelector('.line-numbers-rows') && Prism.util.isActive(n, o)) {
            n.classList.remove(o), t.classList.add(o)
            var i,
              r = e.code.match(a),
              s = r ? r.length + 1 : 1,
              l = new Array(s + 1).join('<span></span>')
            ;(i = document.createElement('span')).setAttribute('aria-hidden', 'true'),
              (i.className = 'line-numbers-rows'),
              (i.innerHTML = l),
              t.hasAttribute('data-start') &&
                (t.style.counterReset = 'linenumber ' + (parseInt(t.getAttribute('data-start'), 10) - 1)),
              e.element.appendChild(i),
              u([t]),
              Prism.hooks.run('line-numbers', e)
          }
        }
      }),
      Prism.hooks.add('line-numbers', function(e) {
        ;(e.plugins = e.plugins || {}), (e.plugins.lineNumbers = !0)
      })
  }
  function u(e) {
    if (
      0 !=
      (e = e.filter(function(e) {
        var n = (function(e) {
          return e ? (window.getComputedStyle ? getComputedStyle(e) : e.currentStyle || null) : null
        })(e)['white-space']
        return 'pre-wrap' === n || 'pre-line' === n
      })).length
    ) {
      var n = e
        .map(function(e) {
          var n = e.querySelector('code'),
            t = e.querySelector('.line-numbers-rows')
          if (n && t) {
            var i = e.querySelector('.line-numbers-sizer'),
              r = n.textContent.split(a)
            i || (((i = document.createElement('span')).className = 'line-numbers-sizer'), n.appendChild(i)),
              (i.innerHTML = '0'),
              (i.style.display = 'block')
            var s = i.getBoundingClientRect().height
            return (i.innerHTML = ''), { element: e, lines: r, lineHeights: [], oneLinerHeight: s, sizer: i }
          }
        })
        .filter(Boolean)
      n.forEach(function(e) {
        var i = e.sizer,
          n = e.lines,
          r = e.lineHeights,
          s = e.oneLinerHeight
        ;(r[n.length - 1] = void 0),
          n.forEach(function(e, n) {
            if (e && 1 < e.length) {
              var t = i.appendChild(document.createElement('span'))
              ;(t.style.display = 'block'), (t.textContent = e)
            } else r[n] = s
          })
      }),
        n.forEach(function(e) {
          for (var n = e.sizer, t = e.lineHeights, i = 0, r = 0; r < t.length; r++)
            void 0 === t[r] && (t[r] = n.children[i++].getBoundingClientRect().height)
        }),
        n.forEach(function(e) {
          var n = e.sizer,
            t = e.element.querySelector('.line-numbers-rows')
          ;(n.style.display = 'none'),
            (n.innerHTML = ''),
            e.lineHeights.forEach(function(e, n) {
              t.children[n].style.height = e + 'px'
            })
        })
    }
  }
})()
!(function() {
  if ('undefined' != typeof Prism && 'undefined' != typeof document) {
    var i = [],
      l = {},
      d = function() {}
    Prism.plugins.toolbar = {}
    var e = (Prism.plugins.toolbar.registerButton = function(e, n) {
        var t
        ;(t =
          'function' == typeof n
            ? n
            : function(e) {
                var t
                return (
                  'function' == typeof n.onClick
                    ? (((t = document.createElement('button')).type = 'button'),
                      t.addEventListener('click', function() {
                        n.onClick.call(this, e)
                      }))
                    : 'string' == typeof n.url
                    ? ((t = document.createElement('a')).href = n.url)
                    : (t = document.createElement('span')),
                  n.className && t.classList.add(n.className),
                  (t.textContent = n.text),
                  t
                )
              }),
          e in l ? console.warn('There is a button with the key "' + e + '" registered already.') : i.push((l[e] = t))
      }),
      t = (Prism.plugins.toolbar.hook = function(a) {
        var e = a.element.parentNode
        if (e && /pre/i.test(e.nodeName) && !e.parentNode.classList.contains('code-toolbar')) {
          var t = document.createElement('div')
          t.classList.add('code-toolbar'), e.parentNode.insertBefore(t, e), t.appendChild(e)
          var r = document.createElement('div')
          r.classList.add('toolbar')
          var n = i,
            o = (function(e) {
              for (; e; ) {
                var t = e.getAttribute('data-toolbar-order')
                if (null != t) return (t = t.trim()).length ? t.split(/\s*,\s*/g) : []
                e = e.parentElement
              }
            })(a.element)
          o &&
            (n = o.map(function(e) {
              return l[e] || d
            })),
            n.forEach(function(e) {
              var t = e(a)
              if (t) {
                var n = document.createElement('div')
                n.classList.add('toolbar-item'), n.appendChild(t), r.appendChild(n)
              }
            }),
            t.appendChild(r)
        }
      })
    e('label', function(e) {
      var t = e.element.parentNode
      if (t && /pre/i.test(t.nodeName) && t.hasAttribute('data-label')) {
        var n,
          a,
          r = t.getAttribute('data-label')
        try {
          a = document.querySelector('template#' + r)
        } catch (e) {}
        return (
          a
            ? (n = a.content)
            : (t.hasAttribute('data-url')
                ? ((n = document.createElement('a')).href = t.getAttribute('data-url'))
                : (n = document.createElement('span')),
              (n.textContent = r)),
          n
        )
      }
    }),
      Prism.hooks.add('complete', t)
  }
})()
!(function() {
  function u(t, e) {
    t.addEventListener('click', function() {
      !(function(t) {
        navigator.clipboard
          ? navigator.clipboard.writeText(t.getText()).then(t.success, function() {
              o(t)
            })
          : o(t)
      })(e)
    })
  }
  function o(e) {
    var t = document.createElement('textarea')
    ;(t.value = e.getText()),
      (t.style.top = '0'),
      (t.style.left = '0'),
      (t.style.position = 'fixed'),
      document.body.appendChild(t),
      t.focus(),
      t.select()
    try {
      var o = document.execCommand('copy')
      setTimeout(function() {
        o ? e.success() : e.error()
      }, 1)
    } catch (t) {
      setTimeout(function() {
        e.error(t)
      }, 1)
    }
    document.body.removeChild(t)
  }
  'undefined' != typeof Prism &&
    'undefined' != typeof document &&
    (Prism.plugins.toolbar
      ? Prism.plugins.toolbar.registerButton('copy-to-clipboard', function(t) {
          var e = t.element,
            o = (function(t) {
              var e = {
                copy: 'Copy',
                'copy-error': 'Press Ctrl+C to copy',
                'copy-success': 'Copied!',
                'copy-timeout': 5e3
              }
              for (var o in e) {
                for (var n = 'data-prismjs-' + o, c = t; c && !c.hasAttribute(n); ) c = c.parentElement
                c && (e[o] = c.getAttribute(n))
              }
              return e
            })(e),
            n = document.createElement('button')
          ;(n.className = 'copy-to-clipboard-button'), n.setAttribute('type', 'button')
          var c = document.createElement('span')
          return (
            n.appendChild(c),
            i('copy'),
            u(n, {
              getText: function() {
                return e.textContent
              },
              success: function() {
                i('copy-success'), r()
              },
              error: function() {
                i('copy-error'),
                  setTimeout(function() {
                    !(function(t) {
                      window.getSelection().selectAllChildren(t)
                    })(e)
                  }, 1),
                  r()
              }
            }),
            n
          )
          function r() {
            setTimeout(function() {
              i('copy')
            }, o['copy-timeout'])
          }
          function i(t) {
            ;(c.textContent = o[t]), n.setAttribute('data-copy-state', t)
          }
        })
      : console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.'))
})()
