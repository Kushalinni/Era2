var qualForm=$("#m_qual_form"),
	aorForm =$("#m_aor_form"),
	expForm =$("#m_exp_form");

var FormRepeater={
	init:function(){
		qualForm.repeater({
			initEmpty:false,
			defaultValues:{
				"text-input":"foo"
			},
			show:function(){console.log('add');$(this).slideDown()},
			hide:function(e){
				if(confirm('Are you sure you want to delete this data?')) {
                    $(this).slideUp(e);
                }
			}
		});	
	}
};
/*https://www.sitepoint.com/file-upload-form-express-dropzone-js/*/
var bannerDropzone={init:function(){
	Dropzone.options.app_banner=
	{paramName:"file",maxFiles:1,maxFilesize:5,addRemoveLinks:false,acceptedFiles:'image/*',uploadMultiple:false,
	headers: {
		/*
		'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value
		*/
	},
	init: function() {
	  this.on('thumbnail', function(e) {
		if ( e.width > 300 || e.height > 300 ) {
		  e.rejectDimensions();
		}
		else {
		  e.acceptDimensions();
		}
	  });
	},
	accept:function(e,o){
		if (e.size==0){o('Empty files will not be uploaded.');}
		e.acceptDimensions = done;
		e.rejectDimensions = function() {o('The image can not be more than 300 by 300 pixels in size');};
	}}
}};
bannerDropzone.init();
var AdvertiseDateRangepicker={init:function(){!function(){
		$("#advertise_daterangepicker").datepicker({
			minDate:getNextDateTomo.init()+" 00:00 AM",
			dateLimit:{"days":60},
			buttonClasses:"m-btn btn",
			applyClass:"btn-primary",
			cancelClass:"btn-secondary",
			timePicker:!0,timePickerIncrement:30,locale:{format:"MM/DD/YYYY h:mm A"}
			,todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}
		},
			function(a,t,n){
				//$("#advertise_daterangepicker .form-control").val(a.format("MM/DD/YYYY h:mm A")+" / "+t.format("MM/DD/YYYY h:mm A"));
				//$("#mona .form-control").val(a.format("MM/DD/YYYY h:mm A")+" / "+t.format("MM/DD/YYYY h:mm A"));
			/*	$("#advPosStartDt2").val(a.format("YYYY/MM/DD"));
				$("#advPosEndDt2").val(t.format("YYYY/MM/DD"));*/
			}
		);
	}()
}};
var getNextDateTomo=function(){return{init:function(){var cd=new Date();var m=cd.getMonth()+1;var y=cd.getFullYear();return m+"/"+(cd.getDate()+1)+"/"+y;}}}();

/*
$scope.safeApply = function( fn ) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
        if(fn) {
            fn();
        }
    } else {
        this.$apply(fn);
    }
};
*/

var todayDate = new Date().getDate();
var endD= new Date(new Date().setDate(todayDate - 15));
var currDate = new Date();
var BootstrapDaterangepicker={init:function(){!function(){$("#m_daterangepicker_1, #m_daterangepicker_1_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"}),
$("#m_daterangepicker_2").daterangepicker(
	{
		minDate: moment(), 
		dateLimit:{"days":14}, // 60
		buttonClasses:"m-btn btn",
		applyClass:"btn-primary",
		cancelClass:"btn-secondary"
	},function(a,t,n){$("#m_daterangepicker_2 .form-control").val(a.format("MM-DD-YYYY")+" to "+ t.format("MM-DD-YYYY"))}),$("#m_daterangepicker_2_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_2 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_4").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",timePicker:!0,timePickerIncrement:30,locale:{format:"MM/DD/YYYY h:mm A"}},function(a,t,n){$("#m_daterangepicker_4 .form-control").val(a.format("MM/DD/YYYY h:mm A")+" / "+t.format("MM/DD/YYYY h:mm A"))}),$("#m_daterangepicker_5").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",singleDatePicker:!0,showDropdowns:!0,locale:{format:"MM/DD/YYYY"}},function(a,t,n){$("#m_daterangepicker_5 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))});var a=moment().subtract(29,"days"),t=moment();$("#m_daterangepicker_6").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",startDate:a,endDate:t,ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]}},function(a,t,n){$("#m_daterangepicker_6 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))})}(),$("#m_daterangepicker_1_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_1_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_2_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))})}};

	var BootstrapDaterangepicker2={init:function(){!function(){$("#m_daterangepicker_1, #m_daterangepicker_1_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"}),
	$("#m_daterangepicker_2b").daterangepicker(
		{
			minDate: moment(), 
			dateLimit:{"days":14}, // 60
			buttonClasses:"m-btn btn",
			applyClass:"btn-primary",
			cancelClass:"btn-secondary"
		},function(a,t,n){$("#m_daterangepicker_2b .form-control").val(a.format("MM-DD-YYYY")+" to "+ t.format("MM-DD-YYYY"))}),$("#m_daterangepicker_2_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_2 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_4").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",timePicker:!0,timePickerIncrement:30,locale:{format:"MM/DD/YYYY h:mm A"}},function(a,t,n){$("#m_daterangepicker_4 .form-control").val(a.format("MM/DD/YYYY h:mm A")+" / "+t.format("MM/DD/YYYY h:mm A"))}),$("#m_daterangepicker_5").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",singleDatePicker:!0,showDropdowns:!0,locale:{format:"MM/DD/YYYY"}},function(a,t,n){$("#m_daterangepicker_5 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))});var a=moment().subtract(29,"days"),t=moment();$("#m_daterangepicker_6").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",startDate:a,endDate:t,ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]}},function(a,t,n){$("#m_daterangepicker_6 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))})}(),$("#m_daterangepicker_1_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_1_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_2_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))})}};
	
jQuery(document).ready(function(){
	FormRepeater.init();
	AdvertiseDateRangepicker.init();	
	BootstrapDaterangepicker.init();
	BootstrapDaterangepicker2.init();
	//jQuery(document).ready(function(){BootstrapDaterangepicker.init()}); 

});

