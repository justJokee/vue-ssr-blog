/* PrismJS 1.25.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+http+pug+sass+scss+scheme&plugins=line-numbers+toolbar */
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
Prism.languages.scheme = {
  comment: /;.*|#;\s*(?:\((?:[^()]|\([^()]*\))*\)|\[(?:[^\[\]]|\[[^\[\]]*\])*\])|#\|(?:[^#|]|#(?!\|)|\|(?!#)|#\|(?:[^#|]|#(?!\|)|\|(?!#))*\|#)*\|#/,
  string: { pattern: /"(?:[^"\\]|\\.)*"/, greedy: !0 },
  symbol: { pattern: /'[^()\[\]#'\s]+/, greedy: !0 },
  character: {
    pattern: /#\\(?:[ux][a-fA-F\d]+\b|[-a-zA-Z]+\b|[\uD800-\uDBFF][\uDC00-\uDFFF]|\S)/,
    greedy: !0,
    alias: 'string'
  },
  'lambda-parameter': [
    { pattern: /((?:^|[^'`#])[(\[]lambda\s+)(?:[^|()\[\]'\s]+|\|(?:[^\\|]|\\.)*\|)/, lookbehind: !0 },
    { pattern: /((?:^|[^'`#])[(\[]lambda\s+[(\[])[^()\[\]']+/, lookbehind: !0 }
  ],
  keyword: {
    pattern: /((?:^|[^'`#])[(\[])(?:begin|case(?:-lambda)?|cond(?:-expand)?|define(?:-library|-macro|-record-type|-syntax|-values)?|defmacro|delay(?:-force)?|do|else|except|export|guard|if|import|include(?:-ci|-library-declarations)?|lambda|let(?:rec)?(?:-syntax|-values|\*)?|let\*-values|only|parameterize|prefix|(?:quasi-?)?quote|rename|set!|syntax-(?:case|rules)|unless|unquote(?:-splicing)?|when)(?=[()\[\]\s]|$)/,
    lookbehind: !0
  },
  builtin: {
    pattern: /((?:^|[^'`#])[(\[])(?:abs|and|append|apply|assoc|ass[qv]|binary-port\?|boolean=?\?|bytevector(?:-append|-copy|-copy!|-length|-u8-ref|-u8-set!|\?)?|caar|cadr|call-with-(?:current-continuation|port|values)|call\/cc|car|cdar|cddr|cdr|ceiling|char(?:->integer|-ready\?|\?|<\?|<=\?|=\?|>\?|>=\?)|close-(?:input-port|output-port|port)|complex\?|cons|current-(?:error|input|output)-port|denominator|dynamic-wind|eof-object\??|eq\?|equal\?|eqv\?|error|error-object(?:-irritants|-message|\?)|eval|even\?|exact(?:-integer-sqrt|-integer\?|\?)?|expt|features|file-error\?|floor(?:-quotient|-remainder|\/)?|flush-output-port|for-each|gcd|get-output-(?:bytevector|string)|inexact\??|input-port(?:-open\?|\?)|integer(?:->char|\?)|lcm|length|list(?:->string|->vector|-copy|-ref|-set!|-tail|\?)?|make-(?:bytevector|list|parameter|string|vector)|map|max|member|memq|memv|min|modulo|negative\?|newline|not|null\?|number(?:->string|\?)|numerator|odd\?|open-(?:input|output)-(?:bytevector|string)|or|output-port(?:-open\?|\?)|pair\?|peek-char|peek-u8|port\?|positive\?|procedure\?|quotient|raise|raise-continuable|rational\?|rationalize|read-(?:bytevector|bytevector!|char|error\?|line|string|u8)|real\?|remainder|reverse|round|set-c[ad]r!|square|string(?:->list|->number|->symbol|->utf8|->vector|-append|-copy|-copy!|-fill!|-for-each|-length|-map|-ref|-set!|\?|<\?|<=\?|=\?|>\?|>=\?)?|substring|symbol(?:->string|\?|=\?)|syntax-error|textual-port\?|truncate(?:-quotient|-remainder|\/)?|u8-ready\?|utf8->string|values|vector(?:->list|->string|-append|-copy|-copy!|-fill!|-for-each|-length|-map|-ref|-set!|\?)?|with-exception-handler|write-(?:bytevector|char|string|u8)|zero\?)(?=[()\[\]\s]|$)/,
    lookbehind: !0
  },
  operator: { pattern: /((?:^|[^'`#])[(\[])(?:[-+*%/]|[<>]=?|=>?)(?=[()\[\]\s]|$)/, lookbehind: !0 },
  number: {
    pattern: RegExp(
      (function(r) {
        for (var e in r)
          r[e] = r[e].replace(/<[\w\s]+>/g, function(e) {
            return '(?:' + r[e].trim() + ')'
          })
        return r[e]
      })({
        '<ureal dec>': '\\d+(?:/\\d+)|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[esfdl][+-]?\\d+)?',
        '<real dec>': '[+-]?<ureal dec>|[+-](?:inf|nan)\\.0',
        '<imaginary dec>': '[+-](?:<ureal dec>|(?:inf|nan)\\.0)?i',
        '<complex dec>': '<real dec>(?:@<real dec>|<imaginary dec>)?|<imaginary dec>',
        '<num dec>': '(?:#d(?:#[ei])?|#[ei](?:#d)?)?<complex dec>',
        '<ureal box>': '[0-9a-f]+(?:/[0-9a-f]+)?',
        '<real box>': '[+-]?<ureal box>|[+-](?:inf|nan)\\.0',
        '<imaginary box>': '[+-](?:<ureal box>|(?:inf|nan)\\.0)?i',
        '<complex box>': '<real box>(?:@<real box>|<imaginary box>)?|<imaginary box>',
        '<num box>': '#[box](?:#[ei])?|(?:#[ei])?#[box]<complex box>',
        '<number>': '(^|[()\\[\\]\\s])(?:<num dec>|<num box>)(?=[()\\[\\]\\s]|$)'
      }),
      'i'
    ),
    lookbehind: !0
  },
  boolean: { pattern: /(^|[()\[\]\s])#(?:[ft]|false|true)(?=[()\[\]\s]|$)/, lookbehind: !0 },
  function: { pattern: /((?:^|[^'`#])[(\[])(?:[^|()\[\]'\s]+|\|(?:[^\\|]|\\.)*\|)(?=[()\[\]\s]|$)/, lookbehind: !0 },
  identifier: { pattern: /(^|[()\[\]\s])\|(?:[^\\|]|\\.)*\|(?=[()\[\]\s]|$)/, lookbehind: !0, greedy: !0 },
  punctuation: /[()\[\]']/
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
