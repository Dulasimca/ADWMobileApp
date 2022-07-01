
export class TableConstants {
    purcahseOrderColumns: any = [];
    consumptionDetailsColumns: any = [];
    consumptionReportColumns: any = [];
    purchaseBillColumns: any = [];
    wardenTableColumns: any = [];
    wardenDetailsReportColumns: any = [];
    registrationColumns: any = [];
    purchaseDetailsReportColumns: any = [];
    openingBalanceReportColumns: any = [];
    hostelReportCols: any = [];
    studentDetailsColumns: any = [];
    studentFacilityReportCols: any = [];
    employeeReportCols: any = [];
    OpeningBalanceColumns: any = [];
    hostelinfrastructureReportCols:any = [];
    monthlywiseintentReportCols:any = [];
    feedingchargetypeReportCols:any = [];
    StudentAttendanceTable: any = [];
    employeeAttendanceReportCols: any = [];
    studentAcademicStatusDetailsColumns: any =[];
    AccHeadColumns: any = [];
    HostelFundColumns: any = [];
    DistrictFundColumns: any = [];
    BMAttendanceReportCols: any = [];
    biometricattendancecountColumns: any = [];
    purchasedetailsReportCols: any = [];
    studentCountReportCols: any = [];
    HstlClosingdateEntryCols: any = [];
    onlineapplicationstatusCols:any = [];
    schoolwisestudentdetailsCols:any = [];
    AccountHeadTable: any = [];
    HostelFundtable: any = [];
    DeviceMappingReportCols: any = [];
    StudentDocumentColumns: any[] = [];
    constructor() {
        this.purcahseOrderColumns = [
            { field: 'Commodity', header: 'Commodity', align: 'left !important'},
            { field: 'Quantity', header: 'Quantity', align: 'right !important'},
            { field: 'Unit', header: 'Unit', align: 'left !important'},
            { field: 'Rate', header: 'Rate', align: 'right !important'},
            { field: 'Total', header: 'Total', align: 'right !important'},
        ];

        this.consumptionReportColumns = [
            { field: 'Districtname', header: 'District', align: 'left !important' },
            { field: 'Talukname', header: 'Taluk', align: 'left !important'  },
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'  },
            { field: 'ConsumptionDate', header: 'Consumption Date', align: 'center !important'  },
            { field: 'TotalStudent', header: 'Total No.Of Students', align: 'right !important'  },
            { field: 'Consumption', header: 'Consumption For', align: 'left !important'  },
            { field: 'Commodity', header: 'Commodity', align: 'left !important'  },
            { field: 'Unit', header: 'Unit', align: 'left !important'  },
            { field: 'OB', header: 'Opening Balance', align: 'right !important'  },
            { field: 'QTY', header: 'Consumed Quantity', align: 'right !important'  },
            { field: 'CB', header: 'Closing Balance', align: 'right !important'  },
        ];

        this.consumptionDetailsColumns = [
            { field: 'Consumption', header: 'Consumption For', align: 'left !important'  },
            { field: 'cDate', header: 'Consumption Date', align: 'center !important'  },
            { field: 'Commodity', header: 'Commodity', align: 'left !important'  },
            { field: 'Unit', header: 'Unit', align: 'left !important'  },
            { field: 'OB', header: 'Opening Balance', align: 'right !important'  },
            { field: 'QTY', header: 'Required Quantity', align: 'right !important'  },
            { field: 'CB', header: 'Closing Balance', align: 'right !important'  },
        ];

        this.purchaseBillColumns = [
            { field: 'billNo', header: 'Bill No.', align: 'left !important' },
            { field: 'bDate', header: 'Bill Date', align: 'center !important' },
            { field: 'billAmount', header: 'Bill Amount', align: 'right !important' },
            { field: 'shopName', header: 'ShopName', align: 'left !important' },
            { field: 'gstNo', header: 'Gst Number', align: 'left !important' },
        ];

        this.wardenTableColumns = [
            { field: 'Name', header: 'Warden Name', align: 'left !important'},
            { field: 'CourseName', header: 'Qualification', align: 'left !important'},
            { field: 'Designation', header: 'Designation', align: 'left !important'},
            { field: 'EMail', header: 'Email', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'PhoneNo', header: 'Mobile No', align: 'center !important'},
            { field: 'Pincode', header: 'Pincode', align: 'center !important'},
          ];

        this.wardenDetailsReportColumns = [
            { field: 'WardenName', header: 'Name', align: 'left !important'},
            { field: 'Qualification', header: 'Qualification', align: 'left !important'},
            { field: 'ServiceJoinedDate', header: 'Service Joined Date', align: 'center !important'},
            { field: 'Designation', header: 'Designation', align: 'left !important'},
            { field: 'HostelJoinedDate', header: 'Hostel Joined Date', align: 'center !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'EMail', header: 'Email', align: 'left !important'},
            { field: 'PhoneNo', header: 'Phone No', align: 'right !important'},
            { field: 'EndDate', header: 'Service End Date', align: 'center !important'},
        ];

        this.registrationColumns = [
            { field: 'studentName', header: 'Name', align: 'left !important'},
            { field: 'age', header: 'Age', align: 'right !important'},
            { field: 'genderName', header: 'Gender', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'mobileNo', header: 'Mobile No.', align: 'right !important'},
            { field: 'instituteName', header: 'Institute Name', align: 'left !important'},
            { field: 'Course', header: 'Course', align: 'left !important'},
            // { field: 'aadharNoMasked', header: 'Aadhar No.', align: 'right !important'},
            { field: 'emisno', header: 'EMIS NO.', align: 'right !important'},
            { field: 'totalYIncome', header: 'Yearly Income', align: 'right !important'},
        ];

        this.studentDetailsColumns = [
            { field: 'admissionNo', header: 'Admission No.', align: 'right !important', width: '100px'},
            { field: 'studentName', header: 'Name', align: 'left !important' , width: '100px' },
            // { field: 'AttendanceId', header: 'Attendance Id', align: 'right !important', width: '100px'},
            { field: 'hostelDName', header: 'District', align: 'left !important', width: '100px'},
            { field: 'hostelTName', header: 'Taluk', align: 'left !important', width: '100px'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important', width: '100px'},
            // { field: 'dob', header: 'Date of birth', align: 'center !important', width: '100px'},
            // { field: 'age', header: 'Age', align: 'right !important', width: '100px'},
            // { field: 'genderName', header: 'Gender', align: 'left !important', width: '100px'},
            // { field: 'bloodgroupName', header: 'Blood Group', align: 'left !important', width: '100px'},
            // { field: 'mobileNo', header: 'Mobile No.', align: 'right !important', width: '100px'},
            // { field: 'mothertongueName', header: 'Mother Tongue', align: 'left !important', width: '100px'},
            // { field: 'religionName', header: 'Religion', align: 'left !important', width: '100px'},
            // { field: 'casteName', header: 'Caste', align: 'left !important', width: '100px'},
            // { field: 'subcasteName', header: 'Sub-Caste', align: 'left !important', width: '100px'},
            { field: 'instituteName', header: 'Institute Name', align: 'left !important', width: '100px'},
            { field: 'Course', header: 'Class', align: 'left !important', width: '100px'},
            { field: 'mediumName', header: 'Medium', align: 'left !important', width: '100px'},
            { field: 'courseYear', header: 'Year', align: 'left !important', width: '100px'},
            // { field: 'disabilityType', header: 'Disability', align: 'left !important', width: '100px'},
            { field: 'distanceFromHostelToHome', header: 'Distance from hostel to home', align: 'right !important', width: '100px'},
            { field: 'distanceFromHostelToInstitute', header: 'Distance from hostel to institute', align: 'right !important', width: '100px'},
            { field: 'emisno', header: 'EMIS No.', align: 'right !important', width: '100px'},
            // { field: 'rationCardrNo', header: 'Ratio Card No.', align: 'right !important', width: '100px'},
            // { field: 'bankAccNo', header: 'Bank Account No.', align: 'right !important', width: '100px'},
            // { field: 'ifscCode', header: 'IFSC Code', align: 'right !important', width: '100px'},
            // { field: 'bankName', header: 'Bank Name', align: 'left !important', width: '100px'},
            // { field: 'branchName', header: 'Branch', align: 'left !important', width: '100px'},
            // { field: 'micrNo', header: 'MICR No.', align: 'left !important', width: '100px'},
            // { field: 'fatherName', header: 'Father Name', align: 'left !important', width: '100px'},
            // { field: 'fatherMoileNo', header: 'Father Contact No.', align: 'right !important', width: '100px'},
            // { field: 'fatherQualification', header: 'Qualification', align: 'left !important', width: '100px'},
            // { field: 'fatherOccupation', header: 'Occupation', align: 'left !important', width: '100px'},
            // { field: 'fatherYIncome', header: 'Total Income', align: 'left !important', width: '100px'},
            // { field: 'motherName', header: 'Mother Name', align: 'left !important', width: '100px'},
            // { field: 'motherOccupation', header: 'Occupation', align: 'left !important', width: '100px'},
            // { field: 'motherQualification', header: 'Qualification', align: 'left !important', width: '100px'},
            // { field: 'motherMoileNo', header: 'Mother Contact No.', align: 'right !important', width: '100px'},
            // { field: 'guardianName', header: 'Guardian Name', align: 'left !important', width: '100px'},
            // { field: 'guardianMobileNo', header: 'Guardian Contact No.', align: 'right !important', width: '100px'},
            // { field: 'lastStudiedInstituteAddress', header: 'Last Studied Institute Address', align: 'left !important', width: '100px'},
            // { field: 'lastStudiedInstituteName', header: 'Last Studied Institute Name', align: 'left !important', width: '100px'},
            // { field: 'totalYIncome', header: 'Total Income', align: 'right !important', width: '100px'},
            // { field: 'Address', header: 'Address', align: 'left !important', width: '100px'},
            // { field: 'village', header: 'Village', align: 'left !important', width: '100px'},
            // { field: 'Districtname', header: 'District', align: 'left !important', width: '100px'},
            // { field: 'Talukname', header: 'Taluk', align: 'left !important', width: '100px'},
            // { field: 'pincode', header: 'Pincode', align: 'right !important', width: '100px'},
        ];

        this.purchaseDetailsReportColumns = [
            { field: 'BillNo', header: 'Bill No.', align: 'left !important'},
            { field: 'BillDate', header: 'Bill Date', align: 'center !important'},
            { field: 'BillAmount', header: 'Bill Amount',align: 'right !important'},
            { field: 'ShopName', header: 'ShopName', align: 'left !important'},
            { field: 'GstNo', header: 'Gst Number', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
        ];

        this.purchasedetailsReportCols = [
            { field: 'BillNo', header: 'Bill No.', align: 'left !important'},
            { field: 'BillDate', header: 'Bill Date', align: 'center !important'},
            { field: 'Commname', header: 'Commodity', align: 'center !important'},
            { field: 'Qty', header: 'Quantity', align: 'left !important'},
            { field: 'UnitId', header: 'Unit Id', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            
        ];
         
        this.openingBalanceReportColumns = [
            { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'CommodityName', header: 'Commodity Name', align: 'left !important'},
            { field: 'Qty', header: 'Quantity', align: 'right !important'},
            { field: 'UnitName', header: 'Unit', align: 'left !important'},
            
        ]

        this.hostelReportCols = [
            { field: 'HostelCode', header: 'Hostel Code', align: 'left !important'},
            { field: 'FunctioningName', header: 'Hostel Type', align: 'left !important'},
            { field: 'HGenderType', header: 'Boys/Girls Hostel', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'HostelNameTamil', header: 'விடுதியின் பெயர்', align: 'left !important'},
            { field: 'HostelOpeningDate', header: 'Hostel Opening Date', width: '100px'},
            { field: 'Name', header: 'Hostel Type', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            // { field: 'BuildingNo', header: 'BuildingNo', width: '100px', align: 'left !important'},
            // { field: 'Street', header: 'Street', width: '100px', align: 'left !important'},
            // { field: 'Landmark', header: 'Landmark', width: '100px', align: 'left !important'},
            { field: 'Pincode', header: 'Pincode', align: 'right !important'},
            { field: 'Phone', header: 'Contact No.', align: 'right !important'},
            { field: 'TotalStudent', header: 'Student Count', align: 'right !important'},
        ]
        this.studentFacilityReportCols = [
            { field: 'Districtname', header: 'District Name', width: '200px', align: 'left !important'},
            { field: 'Talukname', header: 'Hostel Name', width: '200px', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', width: '200px', align: 'left !important'},
            { field: 'FacilityName', header: 'Facility Name', width: '200px', align: 'left !important'},
            { field: 'FacilityType', header: 'Facility Type', width: '200px', align: 'left !important'},
            { field: 'NoOfCounts', header: 'No Of Counts', width: '200px', align: 'left !important'},
            { field: 'Remarks', header: 'Remarks', width: '200px', align: 'left !important'},
        ]
        this.employeeAttendanceReportCols = [
            { field: 'Districtname', header: 'Districtname', width: '100px', align: 'left !important'},
            { field: 'Talukname', header: 'HostelName', width: '100px', align: 'left !important'},
            { field: 'HostelName', header: 'HostelName', width: '100px', align: 'left !important'},
            { field: 'FirstName', header: 'Employee Name', width: '100px', align: 'left !important' },
            { field: 'DesignationName', header: 'Designation', width: '100px', align: 'left !important'},
            { field: 'AttendanceDate', header: 'Attendance Date', width: '100px', align: 'center !important'},
            { field: 'Remarks', header: 'Remarks', width: '100px', align: 'left !important' },
        ]
        this.employeeReportCols = [
            { field: 'hostelDistrict', header: 'District Name', width: '100px', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk Name', width: '100px', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', width: '100px', align: 'left !important'},
            // { field: 'WardenName', header: 'Employee Name', width: '100px', align: 'left !important'},
            { field: 'DesignationName', header: 'Designation', width: '100px', align: 'left !important'},
            { field: 'FirstName', header: 'First Name', width: '100px', align: 'left !important'},
            { field: 'LastName', header: 'Last Name', width: '100px', align: 'left !important'},
            { field: 'GenderName', header: 'Gender', width: '100px', align: 'left !important'},
            { field: 'DOB', header: 'Date of Birth', width: '100px', align: 'center !important'},
            { field: 'Doj', header: 'Service Joined Date', width: '100px', align: 'center !important'},
            { field: 'EmployeeJoinedDate', header: 'Joined Date', width: '100px', align: 'center !important'},
            { field: 'Address', header: 'Address', width: '100px', align: 'left !important'},
            { field: 'Pincode', header: 'Pincode', width: '100px', align: 'left !important'},
            { field: 'NativeDistrict', header: 'Native District', width: '100px', align: 'left !important'},
            { field: 'NativeTaluk', header: 'Native Taluk', width: '100px', align: 'left !important'},
            { field: 'MobileNo', header: 'Mobile No', width: '100px', align: 'left !important'},
            // { field: 'AltMobNo', header: 'Alt Mobile No', width: '100px', align: 'left !important'},
            { field: 'EndDate', header: 'End Date', width: '100px', align: 'centre !important'},
        ]
        this.DeviceMappingReportCols = [
            {field:'Districtname',header:'District Name'},
            {field:'HostelName',header: 'Hostel Name'},
            {field:'DeviceId',header: 'Biometric Device Id'},
            {field:'Flag',header: 'Status'}
        ]
        this.OpeningBalanceColumns = [
            { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
            // { field: 'Districtname', header: 'District', align: 'left !important'},
            // { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            // { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'CommodityName', header: 'Commodity Name', align: 'left !important'},
            { field: 'Qty', header: 'Quantity', align: 'right !important'},
            { field: 'UnitName', header: 'Unit', align: 'left !important'},
        ]

        this.hostelinfrastructureReportCols = [
            { field: 'Districtname', header: 'District' },
            { field: 'Talukname', header: 'Taluk' },
            { field: 'HostelName', header: 'Hostel' },
            { field: 'TotalArea', header: 'Total Area' },
            { field: 'BuildingArea', header: 'Building Area' },
            { field: 'PlaygroundCheck', header: 'Playground' },
            { field: 'CompoundWallCheck', header: 'Compound Wall' },
            { field: 'HostRampFacilityCheck', header: 'Ramp Facility for Physically Challenged'},
            { field: 'NoOfFloor', header: 'Total No Of Floors' },
            { field: 'FloorNo', header: 'Floors' },
            { field: 'StudentRoom', header: 'No of Student Rooms' },
            { field: 'WardenRoom', header: 'No of Warden Rooms' },
            { field: 'Library', header: 'No of Librarys' },
            { field: 'Kitchen', header: 'No of Kitchens' },
            { field: 'BathRoomNos', header: 'No of BathRooms' },
            { field: 'ToiletRoomNos', header: 'No of Toilets' },
            { field: 'UrinalNos', header: 'No of Urinal' },
            { field: 'StudyingArea', header: 'Studying Area' },
        ];

        this.studentAcademicStatusDetailsColumns = [
            { field: 'StudentName', header: 'Student Name' },
            { field: 'Class', header: 'Class' },
        ];

       this.monthlywiseintentReportCols = [
        { field: 'ShortYear', header: 'Accounting Year' },
        { field: 'CommodityName', header: 'Commodity Name' },
        { field: 'UnitName', header: 'Unit' },
        { field: 'Qty', header: 'Quantity' },
        { field: 'MonthwiseDate',  header: 'Month'},
        { field: 'ApprovalStatusName', header: 'Approval Status'},
       ]
       
       this.feedingchargetypeReportCols = [
        
        { field: 'AccountingYear', header: 'Accounting Year' },
        { field: 'FeedingChargeName', header: 'Feeding Charges Type' },
        { field: 'School', header: 'Amount For School' },
        { field: 'College', header: 'Amount For College' },
        { field: 'Flag',  header: 'Status'},

      ]
       this.StudentAttendanceTable = [
        { field: 'StudentName', header: 'Student Name' },
        { field: 'remarks', header: 'Remarks' },

       ]
       this.AccHeadColumns = [
        { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
        { field: 'GONumber', header: 'GO Number', align: 'left !important'},
        { field: 'GroupName', header: 'Group Type', align: 'left !important'},
        { field: 'AccountHeadName', header: 'Account Head', align: 'center !important'},
        { field: 'Amount', header: 'Amount',align: 'right !important'},
    ];

    this.HostelFundColumns = [
        { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
        { field: 'GONumber', header: 'GO Number', align: 'left !important'},
        { field: 'GroupName', header: 'Group Type', align: 'left !important'},
        { field: 'AccountHeadName', header: 'Account Head', align: 'center !important'},
        { field: 'Districtname', header: 'District', align: 'left !important'},
        { field: 'Talukname', header: 'Taluk', align: 'left !important'},
        { field: 'TalukAmount', header: 'Taluk Fund',align: 'right !important'},
    ];
     
    this.DistrictFundColumns = [
        { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
        { field: 'GONumber', header: 'GO Number', align: 'left !important'},
        { field: 'GroupName', header: 'Group Type', align: 'left !important'},
        { field: 'AccountHeadName', header: 'Account Head', align: 'center !important'},
        { field: 'Districtname', header: 'District', align: 'left !important'},
        { field: 'DistrictAmount', header: 'Amount',align: 'right !important'},

    ]
    this.BMAttendanceReportCols = [
        { field: 'SerialNumber', header: 'Machine Serial No', width: '100px', align: 'center !important'},
        { field: 'Districtname', header: 'District Name', width: '100px', align: 'center !important'},
        { field: 'Talukname', header: 'Taluk', align: 'left !important'},
        { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
       // { field: 'DeviceId', header: 'Device No', width: '100px', align: 'center !important'},
        { field: 'StudentName', header: 'Stuent Name', width: '100px', align: 'center !important'},
        { field: 'Name', header: 'Standard/Course', width: '100px', align: 'center !important'},
        { field: 'UserId', header: 'Attendance ID', width: '100px', align: 'center !important'},
        { field: 'LogDate', header: 'Attendance Date', width: '100px', align: 'center !important'},
        //{ field: 'DownloadDate', header: 'Download Date', width: '100px', align: 'center !important'},
       
    ]
    this.biometricattendancecountColumns = [
       // { field: 'Slno', header: 'Hostelid', width: '100px', align: 'center !important'},
        { field: 'HostelName', header: 'Hostel Name', width: '100px', align: 'center !important'},
        { field: 'SerialNumber', header: 'Machine Serial No', width: '100px', align: 'center !important'},
        { field: 'AttendanceDate', header: 'Date', width: '100px', align: 'center !important'},
        { field: 'monyr', header: 'Month/Year', width: '100px'},
        { field: 'StudentCount', header: 'Student Count', width: '100px', align: 'center !important'},
     
    ]
    this.AccountHeadTable = [ 
        { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
        { field: 'GONumber', header: 'GO Number', align: 'left !important'},
        { field: 'GroupName', header: 'Group Type', align: 'left !important'},
        { field: 'AccountHeadName', header: 'Account Head', align: 'center !important'},
        { field: 'Amount', header: 'Alloted Amount',align: 'right !important'},
    ]

    this.HostelFundtable = [
        { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
        { field: 'GONumber', header: 'GO Number', align: 'left !important'},
        { field: 'GroupName', header: 'Group Type', align: 'left !important'},
        { field: 'AccountHeadName', header: 'Account Head', align: 'center !important'},
        { field: 'Districtname', header: 'District', align: 'left !important'},
        { field: 'Talukname', header: 'Taluk', align: 'left !important'},
        { field: 'TalukAmount', header: 'Taluk Fund',align: 'right !important'},
        { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
        { field: 'HostelFund', header: 'Hostel Fund',align: 'right !important'},
    ]

    this.studentCountReportCols = [
        { field: 'hostelDName', header: 'District Name', width: '100px', align: 'left !important'},
        { field: 'hostelTName', header: 'Taluk Name', width: '100px', align: 'left !important'},
        { field: 'HostelName', header: 'Hostel Name', width: '100px', align: 'left !important'},
        { field: 'StudentCount', header: 'Student Count', width: '100px', align: 'left !important'},
        
    ]
    this.HstlClosingdateEntryCols = [
        { field: 'ShortYear', header: 'Academic Year', width: '100px', align: 'center !important'},
        { field: 'AppOpendate', header: 'Application Open Date', width: '100px', align: 'center !important'},
        { field: 'AppClosedate', header: 'Application Close Date', width: '100px', align: 'center !important'},
        { field: 'AppExtendDate', header: 'Application Extend Date', width: '100px', align: 'center !important'},
        { field: 'HstlOpenDate', header: 'Hostel Opening Date', width: '100px', align: 'center !important'},
        { field: 'HstlCloseDate', header: 'Hostel Closing Date', width: '100px', align: 'center !important'},
        
    ]
    this.onlineapplicationstatusCols =[
        { field: 'Districtname',  header: 'District Name', width: '100px', align: 'left !important'},
        { field: 'Talukname',  header: 'Taluk Name', width: '100px', align: 'left !important'},
        { field: 'HostelName',  header: 'Hostel Name', width: '100px', align: 'left !important'},
        { field: 'Name',  header: 'Caste', width: '100px', align: 'left !important'},
        { field: 'TotalCount',  header: 'Total', width: '100px', align: 'left !important'},
        { field: 'Pending',  header: 'Pending', width: '100px', align: 'left !important'},
        { field: 'Selected',  header: 'Selected', width: '100px', align: 'left !important'},
        { field: 'Rejected',  header: 'Rejected', width: '100px', align: 'left !important'},
        { field: 'Remarks',  header: 'Remarks', width: '100px', align: 'left !important'},
    ]
    this.schoolwisestudentdetailsCols=[
        { field: 'Districtname',  header: 'District Name', width: '100px', align: 'left !important'},
        { field: 'Talukname',  header: 'Taluk Name', width: '100px', align: 'left !important'},
        { field: 'HostelName',  header: 'Hostel Name', width: '100px', align: 'left !important'},
        { field: 'InstituteName',  header: 'School/College', width: '100px', align: 'left !important'},
        { field: 'Emisno',  header: 'EMIS No/Registeration No', width: '100px', align: 'left !important'},
        { field: 'CourseTitle',  header: 'Standard/Course', width: '100px', align: 'left !important'},
        { field: 'ClassName',  header: 'Subject', width: '100px', align: 'left !important'},
        { field: 'TotalYearlyIncome',  header: 'Income', width: '100px', align: 'left !important'},
        { field: 'Name',  header: 'Caste', width: '100px', align: 'left !important'},
    ];

    this.StudentDocumentColumns = [
        { field: 'StudentName',  header: 'Student Name', width: '150px', align: 'left !important'},
        { field: 'Dob',  header: 'D.O.B', width: '80px', align: 'left !important'},
        { field: 'MobileNo',  header: 'MobileNo', width: '100px', align: 'right !important'},
    ];
    }
}