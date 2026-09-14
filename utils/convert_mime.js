import mime from 'mime-types';

const test = () => {
    caminho_arquivo = "caminho/para/seu/arquivo.jpg"

    tipo_mime = mime.lookup(caminho_arquivo)

    console.log(`Tipo MIME: ${tipo_mime}`)
};

export const convertToMime = (filePath) => {
    return mime.lookup(filePath);
};