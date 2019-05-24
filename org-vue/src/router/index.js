import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'

import Home from '@/components/Home'

import Search from '@/components/search'

import orgTree from '@/components/orgTree'
import event from '@/components/orgEvent/eventList'
import course from '@/components/orgCourse/courseList'
import teachers from '@/components/orgTeacher/teacherList'
import news from '@/components/orgNews/newsList'
import album from '@/components/orgAlbum/albumList'
import chessbook from '@/components/orgChessbook/chessbookList'
import recruit from '@/components/orgRecruit/recruitList'

import detailTree from '@/components/detailTree'
import eventDetail from '@/components/orgEvent/eventDetail'
import courseDetail from '@/components/orgCourse/courseDetail'
import teachersDetail from '@/components/orgTeacher/teacherDetail'
import newsDetail from '@/components/orgNews/newsDetail'
import albumDetail from '@/components/orgAlbum/albumDetail'
import chessbookDetail from '@/components/orgChessbook/chessbookDetail'
import recruitDetail from '@/components/orgRecruit/recruitDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
          path:'/search',
          name:'search',
          component: Search,
        },
    {
      path:'',
      name:'index',
      component: Index,
      children:[
        {
          path:'/home',
          name:'home',
          component: Home,
        },
        {
          path: '',
          name: 'orgTree',
          component: orgTree,
          children:[
            {
              path: 'event',
              name: 'event',
              component: event
            },
            {
              path: 'course',
              name: 'course',
              component: course
            },
            {
              path: 'teachers',
              name: 'teachers',
              component: teachers
            },
            {
              path: 'news',
              name: 'news',
              component: news
            },
            {
              path: 'album',
              name: 'album',
              component: album
            },
            {
              path: 'chessbook',
              name: 'chessbook',
              component: chessbook
            },
            {
              path: 'recruit',
              name: 'recruit',
              component: recruit
            },
          ]
        },
        {
          path: '',
          name: 'detailTree',
          component: detailTree,
          children:[
            {
              path: 'eventDetail',
              name: 'eventDetail',
              component: eventDetail
            },
            {
              path: 'courseDetail',
              name: 'courseDetail',
              component: courseDetail
            },
            {
              path: 'teachersDetail',
              name: 'teachersDetail',
              component: teachersDetail
            },
            {
              path: 'newsDetail',
              name: 'newsDetail',
              component: newsDetail
            },
            {
              path: 'albumDetail',
              name: 'albumDetail',
              component: albumDetail
            },
            {
              path: 'chessbookDetail',
              name: 'chessbookDetail',
              component: chessbookDetail
            },
            {
              path: 'recruitDetail',
              name: 'recruitDetail',
              component: recruitDetail
            },
          ]
        },
      ]
    },
  ]
})
