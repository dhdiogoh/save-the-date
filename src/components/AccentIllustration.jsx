export default function AccentIllustration({ src, alt = '', style, hideMobile = true }) {
  return (
    <span className={`accent${hideMobile ? ' hide-mobile' : ''}`} style={style}>
      <img src={src} alt={alt} />
    </span>
  )
}
