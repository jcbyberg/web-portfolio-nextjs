import { Children, cloneElement, isValidElement } from 'react'

// CSS cannot select a character, so pink punctuation needs the marks wrapped in
// an element. <Punct> walks its children and wraps every punctuation character
// in <span class="punct">, recursing through nested elements so a heading built
// from several spans still works.
//
// Deliberately NOT applied to .article-body: post copy is rendered from markdown
// as raw HTML, and colouring punctuation inside running prose makes it harder to
// read, which is the opposite of what a body typeface is for. This is display
// and UI type only — headings, labels, nav, the wordmark, the footer.

const PUNCT = /([.,;:!?&·•—–\-'’‘"“”()[\]{}/\…])/g

function wrap(node, keyPrefix) {
  if (typeof node === 'string') {
    const parts = node.split(PUNCT)
    return parts.map((part, i) =>
      PUNCT.test(part) && part.length === 1 ? (
        <span className="punct" key={`${keyPrefix}-${i}`}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => wrap(child, `${keyPrefix}-${i}`))
  }
  if (isValidElement(node) && node.props?.children != null) {
    return cloneElement(node, {
      children: wrap(node.props.children, `${keyPrefix}-c`),
    })
  }
  return node
}

export default function Punct({ children }) {
  return <>{wrap(Children.toArray(children), 'p')}</>
}
