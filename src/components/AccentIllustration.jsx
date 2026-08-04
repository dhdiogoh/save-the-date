export default function AccentIllustration({ src, alt = '', style, hideMobile = false }) {
  return (
    <span className={`accent${hideMobile ? ' hide-mobile' : ''}`} style={style}>
      <img src={src} alt={alt} />
    </span>
  )
}
