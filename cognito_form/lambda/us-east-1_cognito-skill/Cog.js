class Cog{

   static yesNo(formAns){

      if(formAns =="yes"){
          formAns="true";
      }
      else if(formAns == "no"){
           formAns="false";
      }

       return formAns;
    }

   static checkBoxes(formAnsArr){

      var formAns='[';

      for(var i=0; i < formAnsArr.length; i++){
          formAns+= '"'+formAnsArr[i]+'",';
      }

      formAns= formAns.replace(/,+$/, "")+']';
       //formAns= "got it from cog";
       return formAns;

   }
   static checkBoxesArr(formAns){
       var temp;
       var str="";
       var temp2

       temp= formAns.split(' ');
       for(var i=0; i < temp.length; i++)
           if( temp[i] != 'and')
              str+=temp[i]+',';

      str= str.substring(0, str.length-1);
      //str.replace(/,+$/, "");

      temp2= str.split(',');

       return temp2;
   }

   static time(formAns){              //13:00:00

       return formAns+= ":00";

   }
   static time12h(formAns){
        var temp= formAns.split(':');
        var hour= (Number(temp[0]) > 12)? Number(temp[0]) - 12 : Number(temp[0]);
        var amPM;

        if( Number(temp[0]) < 12)
          amPM= ' am';
        else
          amPM=' pm';

        if(hour == 0)
            hour= 12;

        return hour+':'+temp[1]+amPM;


   }


}
module.exports= Cog;
