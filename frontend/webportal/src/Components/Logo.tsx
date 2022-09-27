import logo from "../Assets/Images/logo.png";

interface LogoProps {
    width: string;
    height: string;
    styles?: React.CSSProperties;
}

const Logo = (props: LogoProps) => {
    return <img src={logo} style={{width: props.width, height: props.height, ...props.styles ?? null}}/>
}

export default Logo;