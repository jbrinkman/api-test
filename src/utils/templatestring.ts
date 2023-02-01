/**
 * Produces a function which uses template strings to do simple interpolation from objects.
 *
 * Usage:
 *    const myStringFunc = generateTemplateString('${region} is in ${country}!');
 *
 *    console.log(myStringFunc({ region: 'Florida', country: 'USA'}));
 *    // Logs 'Florida is in USA!'
 */
export const generateTemplateString = (function () {
  let cache: Record<string, any> = {}

  function generateTemplate(template: string) {
    let fn = cache[template]

    if (!fn) {
      // Replace ${expressions} (etc) with ${map.expressions}.

      let sanitized = template
        .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
          return `\$\{map.${match.trim()}\}`
        })
        // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
        .replace(/(\$\{(?!map\.)[^}]+\})/g, '')

      fn = Function('map', `return \`${sanitized}\``)
    }

    return fn
  }

  return generateTemplate
})()
