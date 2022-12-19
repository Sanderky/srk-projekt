import logo from "../Assets/Images/logo.png";
import styles from './Logo.module.css'

interface LogoProps {
    width: string;
    height: string;
    styles?: React.CSSProperties;
}

const Logo = (props: LogoProps) => {
    return <img src={logo} className='logoImg' style={{ width: props.width, height: props.height, ...styles ?? null }} />
}

export default Logo;