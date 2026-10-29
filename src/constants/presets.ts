import { SchoolSettings, SchoolCardItem } from '../types';

export const THEME_COLORS = [
  '#0C7C82', // สีหลักเขียวหัวเป็ด
  '#35B4B0', // สีหลักพาสเทลเทอร์คอยส์
  '#26A69A', // เขียวอมฟ้า
  '#AED581', // เขียวพาสเทล
  '#FFCA28', // เหลืองอำพัน
  '#FF8A65', // ส้มคอรัลพาสเทล
  '#EF5350', // แดงพาสเทล
  '#4A2C6D', // ม่วงเข้มสง่างาม
  '#D32F2F', // แดงชาด
  '#F57C00', // ส้มทอง
  '#FBC02D', // ทอง
  '#0288D1', // ฟ้าเข้มสดใส
];

export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'โรงเรียนอนุบาลศรีสุทโธ',
  affiliation: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาประถมศึกษาอุดรธานี เขต 3',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
  bgUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
  columns: 4,
  columnsPC: 4,
  columnsTablet: 3,
  columnsMobile: 2,
  adminPin: '1234',
  updatedAt: new Date().toISOString(),
};

// Preset system card templates for quick selection when adding new cards
export const SYSTEM_PRESETS: Array<{
  name: string;
  category: string;
  defaultUrl: string;
  color: string;
  iconName: string;
  imageUrl: string;
}> = [
  {
    name: 'SGS ระบบวัดผล',
    category: 'วิชาการ',
    defaultUrl: 'https://sgs.bopp-obec.info',
    color: '#0C7C82',
    iconName: 'Award',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'DMC ข้อมูลนักเรียน',
    category: 'บริหารทั่วไป',
    defaultUrl: 'https://portal.bopp-obec.info/dmc',
    color: '#0288D1',
    iconName: 'Users',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'EMIS สารสนเทศการศึกษา',
    category: 'สารสนเทศ',
    defaultUrl: 'https://emis.bopp-obec.info',
    color: '#35B4B0',
    iconName: 'BarChart3',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'B-OBEC สิ่งก่อสร้าง',
    category: 'บริหารทั่วไป',
    defaultUrl: 'https://bobec.bopp-obec.info',
    color: '#F57C00',
    iconName: 'Building2',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'P-OBEC ข้อมูลบุคลากร',
    category: 'บุคคล',
    defaultUrl: 'https://pobec.bopp-obec.info',
    color: '#4A2C6D',
    iconName: 'UserCheck',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'SchoolMIS ระบบสารสนเทศ',
    category: 'วิชาการ',
    defaultUrl: 'https://www.schoolmis.com',
    color: '#26A69A',
    iconName: 'GraduationCap',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'E-Saraban สารบรรณอิเล็กทรอนิกส์',
    category: 'บริหารทั่วไป',
    defaultUrl: 'https://saraban.obec.go.th',
    color: '#EF5350',
    iconName: 'FileText',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'OBEC Care ดูแลนักเรียน',
    category: 'กิจการนักเรียน',
    defaultUrl: 'https://care.obec.go.th',
    color: '#FF8A65',
    iconName: 'HeartHandshake',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'E-Library ห้องสมุดดิจิทัล',
    category: 'แหล่งเรียนรู้',
    defaultUrl: 'https://elibrary.obec.go.th',
    color: '#AED581',
    iconName: 'BookOpen',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Smart School ตารางสอน',
    category: 'วิชาการ',
    defaultUrl: 'https://timetable.school.th',
    color: '#FBC02D',
    iconName: 'CalendarDays',
    imageUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Google Classroom',
    category: 'การเรียนการสอน',
    defaultUrl: 'https://classroom.google.com',
    color: '#FFCA28',
    iconName: 'Laptop',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'DEEP แพลตฟอร์มการศึกษา',
    category: 'วิชาการ',
    defaultUrl: 'https://deep.go.th',
    color: '#0C7C82',
    iconName: 'Globe',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
  },
];

export const DEFAULT_CARDS: SchoolCardItem[] = [];

