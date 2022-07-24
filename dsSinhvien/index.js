const fs=require('fs');
const util=require('util')

class dataLoad{
    data;
    load(path){
        let rawData=fs.readFileSync(path);
        this.data=JSON.parse(rawData);
    }
    print(){
        console.log(this.data);
    }
}
class studentManage{
    studentList=new Array();
    classList=new Array();
    init(data){
        data.forEach((stu) => {
            let infor= new studentInfor(stu),
                score=new scoreData(
                    new scoreType(stu.diemToan,alpha(stu.diemToan)),
                    new scoreType(stu.diemLy,alpha(stu.diemLy)),
                    new scoreType(stu.diemHoa,alpha(stu.diemHoa)),
                    new scoreType(stu.diemAnh,alpha(stu.diemAnh)),
                ),
                student=new Student(infor,score);
            this.studentList.push(student);
            this.classList.push(student.infor.className);
        });
    }
    Max(className){
        let max=0;
        let inClass=this.studentList.filter((stu)=>{
            return (stu.infor.className==className)
        })
        inClass.forEach((stu)=>{
            max=(stu.score.average()>max)?stu.score.average():max;
        })
        return max;
    }
    Min(className){
        let min=10;
        let inClass=this.studentList.filter((stu)=>{
            return (stu.infor.className==className)
        })
        inClass.forEach((stu)=>{
            min=(stu.score.average()<min)?stu.score.average():min;
        })
        return min;
    }
    passedStu(){
        let passedList=this.studentList.filter((stu)=>{
            return stu.isPassed();
        })
        return passedList;    
    }
    uniqueClassesList(){
        let uniqueList=[...new Set (this.classList)]
        return uniqueList;
    }

}
class Person {
    name;
    age;
    sex;
    dob;
    constructor(name,age,sex,dob){
        this.name=name;
        this.age=age;
        this.sex=sex;
        this.dob=dob;
    }
}
class studentInfor extends Person{
    className;
    id;
    constructor(data) {
        super(data.tenSV,data.tuoi,data.gioiTinh,data.ngaySinh);
        this.id=data.maSV;
        this.className=data.lop;        
    }
}

class scoreData {
    maths;  
    phys;  
    chem;   
    eng;    
    constructor(maths,phys,chem,eng){
        this.maths=maths
        this.phys=phys;
        this.chem=chem;
        this.eng=eng;
    }
    average(){
        return (this.maths.number+this.phys.number+this.chem.number+this.eng.number)/4;
    }
}
function alpha(x){
        if(x>=8.5)return 'A';
        if(x>=7.0)return'B';
        if(x>=5.5) return 'C';
        if(x>=5) return 'D';
        if(x>=4)return 'D+';
        return 'F';
}
class scoreType {
    number;
    alpha;
    constructor(number,alpha){
        this.number=number;
        this.alpha=alpha;
    }
}
class Student{
    infor;
    score;
    passed;
    rank;
    constructor(infor,score){
        this.infor=infor;
        this.score=score;
        this.passed=this.isPassed();
        this.rank=this.initRank();
    }
    isPassed(){
        if(this.score.maths.number<4||this.score.phys.number<4||this.score.chem.number<4||this.score.eng.number<4)return false;
        return true;
    }

    //xep loai sinh vien
    initRank(){
        if (!this.isPassed())return 'F';
        if (this.score.average()>=9) return 'S';
        if (this.score.average()>=8) return 'A';
        if (this.score.average()>=7) return 'B';
        if (this.score.average()>=5) return 'C';
        if (this.score.average()>=4) return 'D';
        return 'F';
    }

}

const main= new dataLoad();
main.load('data.json');
const manage=new studentManage();
manage.init(main.data);

console.log("Danh sách sv:",util.inspect(manage.studentList,false,null,true));
manage.uniqueClassesList().forEach((e)=>{
    console.log("Điểm cao nhất lớp",e,"là",manage.Max(e));
    console.log("Điểm thấp nhất lớp",e,"là",manage.Min(e));
})
console.log("\n***\n\nDanh sách sv qua môn:",util.inspect(manage.passedStu(),false,null,true));



//Loc sinh vien
console.log("\n***\n\nLoc theo ten:",util.inspect(manage.studentList.filter((x)=>{
    return x.infor.name=="Nguyen Van A";
}),false,null,true));

console.log("\n***\n\nLoc theo diem:",util.inspect(manage.studentList.filter((x)=>{
    return x.score.maths.number==9;
}),false,null,true));

console.log("\n***\n\nLoc theo lop:",util.inspect(manage.studentList.filter((x)=>{
    return x.infor.className=="IT-02";
}),false,null,true));

console.log("\n***\n\nLoc theo tuoi:",util.inspect(manage.studentList.filter((x)=>{
    return x.infor.age==20;
}),false,null,true));
