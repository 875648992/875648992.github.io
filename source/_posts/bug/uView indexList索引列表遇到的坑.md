---
title: uView indexList索引列表遇到的坑
tags: [uniapp,uView]
date: 2022-05-19 12:21:17
categories: [bug,组件]
---

## 在使用uView索引列表做通讯录的时候遇到了几个问题
先上图片
![在这里插入图片描述](https://img-blog.csdnimg.cn/a20570b6735e46b6bca55aaec0483167.png)


>问题1: 右侧的abcd首字母按钮点击错乱  比如点了f  弹出显示的是a开头的人(应该是f开头的人才对)
- 通过排查  发现传入这个右侧组件参数的时候  后端并没有返回完整的A-Z  而是有A首字母的数据  才返回了A  没有F首字母的  就没有返回F 导致数据整体A-Z不完整  所以传进入组件后显示就出问题了  所以不管数据有没有都要想办法把A-Z匹配完整才行  
>问题2: 点击右侧的按钮 不会锚点跳转  比如点击Z  要跳转到Z的首字母那里去
- 后来发现uView只提供了点击右侧按钮的回调方法 (可以拿到点击的字母)  并不自带跳转  于是我们首先给每一个列表添加上一个id  id就是当前的字母  然后通过dom拿到这个元素距离顶部的距离  然后拿到最外层的元素顶部的距离  去滚动即可

```javascript
 clickSelect(e) {
        //从当前位置到达目标位置
        uni
          .createSelectorQuery()
          .select('#' + e) 
          .boundingClientRect((data) => {
            //目标位置的节点：类或者id
            uni
              .createSelectorQuery()
              .select('.container')
              .boundingClientRect((res) => {
                //最外层盒子的节点：类或者id
                this.$nextTick(function () {
                  uni.pageScrollTo({
                    scrollTop: data.top - res.top,
                    duration: 0 //app端这个必须设置成0
                  })
                })
              })
              .exec()
          })
          .exec()
      },
```
- [如果uni.pageScrollTo滚动不了  就去看这篇文章](https://blog.csdn.net/gun_kill_seven/article/details/112464970?utm_medium=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~default-1.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~default-1.no_search_link)

>2022年  第二次更新
>第二个问题其实是是索引列表自带了跳转的  上面我写的方法其实也可以不用 主要还是数据格式要对才行  

>楼下放上mock数据格式 和源码 `业务代码直接复制的  有些东西是无用的  可以自行删除`

```javascript
export const aaa = [
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'A'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'B'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'C'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'D'
  },
  {
    data: [],
    letter: 'E'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'F'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'G'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'H'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'I'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'J'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'K'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'L'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'M'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'N'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'O'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'P'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'Q'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'R'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'S'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'T'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'U'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'V'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'W'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'X'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'Y'
  },
  {
    data: [
      {
        id: '9e2c82ee2a054496bf6297442763d5c4',
        provinceName: '海南省',
        cityName: '三亚市',
        countyName: '天涯区',
        townName: '天涯镇',
        villageId: '460204198222',
        villageName: '抱前村',
        groupName: '干沟一村',
        groupId: '46020419822208',
        address: '海南省|三亚市|天涯区|天涯镇|抱前村|干沟一村',
        fullName: '邱明俊',
        fullNameInitials: 'Q',
        phone: '13222222222',
        roleCode: 'villager',
        roleName: '',
        idcard: '340825199611010412',
        managingIdcard: '340825199611010412',
        positionName: null,
        avatar: null,
        isRegister: '0',
        isPartyMember: '0',
        isGridMember: '2',
        gender: null,
        partyBranchCommittee: null,
        villagerCommittee: null,
        userId: '1431210121718927361'
      }
    ],
    letter: 'Z'
  }
]

```

```javascript
<!--
 * @Author: LWF
 * @Date: 2021-09-01 18:43:10
 * @LastEditTime: 2021-09-22 11:20:02
 * @LastEditors: Please set LastEditors
 * @FilePath: /src/pagesCountry/address/index.vue
 * @Description: 通讯录
-->
<template>
  <view class="container wrapper">
    <view class="header" style="padding: 10px">
      <u-search
        bg-color="#fff"
        placeholder="搜索姓名 / 小组名 / 身份类型"
        :show-action="false"
        v-model="keyword"
        @change="searchChange"
      ></u-search>
      <u-icon
        @click="tooptilpShow = true"
        name="info-circle"
        color="#2979ff"
        size="40"
      ></u-icon>
      <u-modal
        v-model="tooptilpShow"
        content="搜索以下身份类型，可批量展示该身份的村民: 党员、村组长、户主、网格员、村民委员会、村党支部委员"
      ></u-modal>
    </view>
    <view class="main">
      <u-index-list :scrollTop="scrollTop">
        <view v-for="(item, index) in indexList" :key="index" :id="item.letter">
          <u-index-anchor :index="item.letter" v-show="item.data.length" />
          <view class="list" v-for="(n, i) in item.data" :key="i">
            <view>
              <text>{{ n.fullName }}</text>
              <text class="label-grounp">{{ n.groupName }}</text>
            </view>
            <view class="icon">
              <u-icon
                @click="chat"
                name="/static/image/i-msg.png"
                style="margin-right: 13px"
                size="55"
              ></u-icon>
              <u-icon
                @click="call(n.phone)"
                name="/static/image/i-phone.png"
                size="55"
              ></u-icon>
            </view>
          </view>
        </view>
      </u-index-list>
    </view>
  </view>
</template>

<script>
  import { getUserList } from '@/api/send/index'
  import { aaa } from './list'
  export default {
    data() {
      return {
        show: false,
        tooptilpShow: false,
        scrollTop: 0,
        indexList: [],
        list2: [],
        list1: [],
        keyword: ''
      }
    },
    onPageScroll(e) {
      console.log('执行')
      this.scrollTop = e.scrollTop
    },
    onLoad(val) {
      //   获取所有人  
      this.getAllList()
    },
    methods: {
      //  点击锚点跳转 
      // clickSelect(e) {
      //   //从当前位置到达目标位置
      //   uni
      //     .createSelectorQuery()
      //     .select('#' + e)
      //     .boundingClientRect((data) => {
      //       //目标位置的节点：类或者id
      //       uni
      //         .createSelectorQuery()
      //         .select('.container')
      //         .boundingClientRect((res) => {
      //           //最外层盒子的节点：类或者id
      //           this.$nextTick(function () {
      //             uni.pageScrollTo({
      //               scrollTop: data.top - res.top,
      //               duration: 0 //app端这个必须设置成0
      //             })
      //           })
      //         })
      //         .exec()
      //     })
      //     .exec()
      // },
      //   选择所有人 
      getAllList() {
        const params = {
          searchValue: this.keyword
        }
       // 这里数获取数据 换成mock的数据即可
        getUserList(params).then((res) => {
          // this.indexList = aaa
          this.indexList = res.data
          this.indexList.filter((item) => {
            if (!item.data) {
              item.data = []
            }
          })
        })
      },
      //   跳转到聊天 
      chat() {},
      //   打电话 
      call(val) {
        uni.makePhoneCall({
          // 手机号
          phoneNumber: val
        })
      },
      //   搜索 
      searchChange() {
        this.page = 1
        this.sendList = []
        this.getAllList()
      },
      //   点击提示 
      tooptilp() {}
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    .btn {
      width: 200rpx;
      height: 60rpx;
      // float: right;
      // margin-right: 30rpx;
    }
  }
  .main {
    .radio-group {
      //
      display: flex;
      flex-direction: column;
    }
  }
  .footers {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: auto;
    padding: 20rpx;
    display: flex;
    justify-content: flex-end;
    background-color: #fff;
    z-index: 999;
  }
  .list {
    background-color: #fff;
    padding: 10rpx 40rpx;
    font-size: 17px;
    display: flex;
    justify-content: space-between;
    .icon {
      margin-right: 20px;
    }
  }
  .footer {
    background-color: white;
    display: flex;
    .btn {
      height: 60rpx;
      width: 180rpx;
    }
  }
  .headerFlex {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
  }
  .label-grounp {
    font-size: 12px;
    background-color: #69d4af;
    padding: 3px;
    color: #f5f5f5;
    border-radius: 8px;
    margin-left: 10px;
  }
  .wrapper {
    height: auto !important;
  }
  .fiex {
    position: fixed;
    top: 40px;
    z-index: 999;
  }

  ::v-deep {
    .u-index-bar__index {
      color: #000 !important;
    }
  }
</style>

```



