// ==============================|| DROPZONE - GET FILE INFO ||============================== //

export default function getDropzoneData(file, index) {
if (typeof file === 'string') {
    key: index ? `${file}-${index}` : file,
    preview: file
}
    };
  }

  return {
    key: index ? `${file.name}-${index}` : file.name,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate
  };
}
