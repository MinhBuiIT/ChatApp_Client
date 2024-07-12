import { transformImg } from '../../utils/helper';
import ButtonFileAttach from '../ButtonFileAttach';

const RenderFile = ({ url, type, style, fileName = '', isTransform = true }) => {
  const urlConfig = isTransform ? transformImg(url, 300) : url;
  switch (type) {
    case 'image':
      return (
        <img
          src={urlConfig}
          style={{ ...style, borderRadius: '10px', objectFit: `${isTransform ? 'cover' : 'contain'}` }}
        />
      );
    case 'video':
      return <video src={urlConfig} style={style} preload="none" controls />;
    case 'audio':
      return <audio controls src={urlConfig} preload="none"></audio>;
    default:
      return (
        <>
          <ButtonFileAttach fileName={fileName} urlFile={url} />
        </>
      );
  }
};

export default RenderFile;
