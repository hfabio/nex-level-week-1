import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUpload: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUpload }) => {

  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');

  const onDrop = useCallback(acceptedFiles => {
    const file: File = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(prevState => prevState !== fileUrl ? fileUrl : prevState);

    onFileUpload(file);

  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {
        selectedFileUrl
          ?
          (
            <>
              <img src={selectedFileUrl} alt="Foto do estabelecimento" style={{ borderRadius: '10px' }} />
              <p style={{ position: 'absolute', backgroundColor: '#FFF', color: '#000', fontWeight: 'bold', width: '380px', height: '32px' }}>Arraste outra imagem ou clique para modificar...</p>
            </>
          )
          :
          (

            isDragActive
              ?
              <p>Solte a foto aqui...</p>
              :
              <p>
                <FiUpload />
                Selecione imagem do estabelecimento ou arraste até aqui...
              </p>
          )
      }
    </div>
  )
}

export default Dropzone;