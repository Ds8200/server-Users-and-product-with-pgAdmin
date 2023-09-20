export const getDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // יונובמר הוא חודש 0, ינואר הוא 1 וכך הלאה
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    // console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}