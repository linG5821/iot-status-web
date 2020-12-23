<template>
  <div class="app-container">
    <div class="block">
      <el-date-picker
        v-model="dates"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
        @change="fetchData"
      />
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column
        align="center"
        label="客户端ID"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.clientId }}
        </template>
      </el-table-column>
      <el-table-column
        prop="receivedTcpPacketsCount"
        label="接收的TCP报文数"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.receivedTcpPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="receivedPublishPacketsCount"
        label="接收的PUBLISH报文数"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.receivedPublishPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="receivedBytesCount"
        label="接收的字节数量"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.receivedBytesCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="receivedMqttPacketsCount"
        label="接收的MQTT报文数"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.receivedMqttPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sentTcpPacketsCount"
        label="发送的TCP报文数"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.sentTcpPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sentPublishPacketsCount"
        label="发送的PUBLISH报文数"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.sentPublishPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sentBytesCount"
        label="发送的字节数量"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.sentBytesCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sentMqttPacketsCount"
        label="发送的MQTT报文数量"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.sentMqttPacketsCount }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[10, 30, 100]"
      :total="total"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getClientStates } from '@/api/client-states'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      listLoading: true,
      sort: 'receivedPublishPacketsCount',
      direction: 'DESC',
      dates: this.handleDefaultDate(),
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    sortChange(params) {
      const { column, prop, order } = params
      this.sort = prop
      this.direction = order === 'descending' ? 'DESC' : 'ASC'
      if (column == null) {
        this.sort = 'receivedPublishPacketsCount'
      }
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getClientStates({
        startDate: this.dates[0],
        endDate: this.dates[1],
        sort: this.sort,
        direction: this.direction,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(response => {
        this.list = response.data
        this.pageNum = response.pageNum
        this.pageSize = response.pageSize
        this.total = response.total
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleDefaultDate() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
      return [start, end]
    }
  }
}
</script>
