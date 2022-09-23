import styles from './CompanyName.module.css';

interface CompanyNameProps {
    color: string;
    size: string;
    style?: React.CSSProperties;
}

const CompanyName = (props: CompanyNameProps) => {
    
    return <div className={styles.name} style={{color: props.color, fontSize: props.size, ...props.style}}>SRK</div>
}

export default CompanyName;