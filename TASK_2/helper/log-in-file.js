import fs from 'fs';

/**
 * 
 * Create a file with the content, using the name sent and in the directory informed.
 * 
 * @param path 
 * @param file_name 
 * @param content 
 */
export function generate(path, file_name, content){
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    
    fs.writeFileSync(`${path}/${file_name}`, content);
}