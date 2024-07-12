import style from './containerBackground.module.css';
const ContainerBackground = ({ children }) => {
  return <div className={style['container']}>{children}</div>;
};

export default ContainerBackground;
