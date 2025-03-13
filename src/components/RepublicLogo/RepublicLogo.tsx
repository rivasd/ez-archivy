

const RepublicLogo = ({color, width, height}) => {

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 600 600">
      <circle fill="none" stroke={color} strokeWidth="31.8518" cx="300" cy="300" r="284.0741"/>
      <circle fill={color} cx="300" cy="300" r="93.2122"/><g id="Half" fill={color}><g id="Elmt" fill={color}>
      <path d="M164.331,122.014A223.797,223.797 0 0,1 270.077,78.2125 V48.1605A253.611,253.611 0 0,0 143.081,100.764Z"/>
      <path fill={color} stroke={color} strokeWidth="38.881" d="M300,300v187.968"/>
      </g><use xlinkHref="#Elmt" transform="rotate(45,300,300)" fill={color}/>
      <use xlinkHref="#Elmt" transform="rotate(90,300,300)" fill={color}/>
      <use xlinkHref="#Elmt" transform="rotate(135,300,300)" fill={color}/></g>
      <use xlinkHref="#Half" transform="rotate(180,300,300)" fill={color}/>
    </svg>
  )
}

export default RepublicLogo