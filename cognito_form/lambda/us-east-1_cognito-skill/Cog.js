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

   static checkBoxes(formAns){
      var temp;
      var temp2;

       temp= formAns.replace(/and/g,"");
       temp2= temp.split(' ');

      formAns='[';

      for(var i=0; i < temp2.length; i++){
          formAns+= '"'+temp2[i]+'",';
      }

      formAns= formAns.replace(/,+$/, "")+']';
       //formAns= "got it from cog";
       return formAns;

   }
   static checkBoxesArr(formAns){
       var temp;
       var temp2;

       temp= formAns.replace(/and/g,'');
       temp2= temp.split(' ');

       return temp2;
   }

   static time(formAns){              //13:00:00

       return formAns+= ":00";

   }



}
module.exports= Cog;
