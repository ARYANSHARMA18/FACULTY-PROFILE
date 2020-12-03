let request=require("request");
let ch=require("cheerio");
let fs=require("fs");
let path=require("path");
let xlsx=require("xlsx");
request("http://www.bpitindia.com/electronics-and-communication-engineering-faculty-profile.html#",profile);
function profile(err,res,html)
{
    Stool=ch.load(html);
    let facProfile=Stool("div.row");
    for(let i=6;i<facProfile.length-1;i++)

    {
        let facName=Stool(facProfile[i]).find(".d_inline.fw_600").text().trim();
        let fac=Stool(facProfile[i]).find("table.table.table-bordered.table-responsive ").find("tbody");
    for(let j=0;j<fac.length;j++)
    {
        let row=Stool(fac[j]).find("td");
        let qual=Stool(row[0]).text().trim();
        let email=Stool(row[2]).text().trim();
        let experience=Stool(row[4]).text().trim();
       let research= Stool(row[6]).text().trim();
        let Natpublic=Stool(row[8]).text().trim();
       let interPublic=Stool(row[10]).text().trim();
       console.log(`Name:${facName} Qualification:${qual} E-mail:${email} Experience:${experience} Research:${research} National-Publications:${Natpublic} International Publications:${interPublic}`);
       console.log("-------------------------------------------------------");
       processfacProfile(facName,qual,email,experience,research,Natpublic,interPublic);
    }}
}
 function processfacProfile(name,qual,email,exp,research,natpub,interpub){
    let dirPath=name;
    let fProfile={
       Name:name,
        Qualification:qual,
        Email:email,
        Experience:exp,
         Research: research,
        National_Publication:natpub,
        International_Publication:interpub
    }
        if(fs.existsSync(dirPath)){
        }
        else{
    fs.mkdirSync(dirPath);
        }
    
       let facFilePath=path.join(dirPath,name+".xlsx");
       let pData=[];
       if (fs.existsSync(facFilePath))
       {
           pData=excelReader(facFilePath,name);
           pData.push(fProfile);
       }
       else{
           console.log("File of Factulty",facFilePath,"created");
           pData=[fProfile];
           }
            excelWriter(facFilePath,pData,name);
    }
    function excelReader(filePath,name){
        if(!fs.existsSync(filePath)){
            return null;
        }
        else{
            let wt=xlsx.readFile(filePath);
            let excelData=wt.Sheets[name];
            let ans=xlsx.utils.sheet_to_json(excelData);
            return ans;
        }
    }
    function excelWriter(filePath,json,name){
        let newWB=xlsx.utils.book_new();
        let newWS=xlsx.utils.json_to_sheet(json);
        xlsx.utils.book_append_sheet(newWB,newWS,name);
        xlsx.writeFile(newWB,filePath);
    }