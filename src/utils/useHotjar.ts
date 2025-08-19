import { useEffect } from 'react'

export const useHotjar = () => {
  const hotjarId = import.meta.env.VITE_HOTJAR_ID

  useEffect(() => {
    if (!hotjarId || document.getElementById('hotjar-script')) return

    const script = document.createElement('script')
    script.id = 'hotjar-script'
    script.innerHTML = `
    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          ;(h.hj.q = h.hj.q || []).push(arguments)
        }
      h._hjSettings = { hjid: ${hotjarId}, hjsv: 6 }
      a = o.getElementsByTagName('head')[0]
      r = o.createElement('script')
      r.id= "hotjar-script"
      r.async = 1
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      a.appendChild(r)
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
    `
    document.head.appendChild(script)
  }, [hotjarId])
}
