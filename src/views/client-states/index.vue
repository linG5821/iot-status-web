<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="客户端ID" width="160">
        <template slot-scope="scope">
          {{ scope.row.clientId }}
        </template>
      </el-table-column>
      <el-table-column label="接收的TCP报文数">
        <template slot-scope="scope">
          {{ scope.row.receivedTcpPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column label="接收的PUBLISH报文数">
        <template slot-scope="scope">
          {{ scope.row.receivedPublishPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column label="接收的字节数量">
        <template slot-scope="scope">
          {{ scope.row.receivedBytesCount }}
        </template>
      </el-table-column>
      <el-table-column label="接收的MQTT报文数">
        <template slot-scope="scope">
          {{ scope.row.receivedMqttPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column label="发送的TCP报文数">
        <template slot-scope="scope">
          {{ scope.row.sentTcpPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column label="发送的PUBLISH报文数">
        <template slot-scope="scope">
          {{ scope.row.sentPublishPacketsCount }}
        </template>
      </el-table-column>
      <el-table-column label="发送的字节数量">
        <template slot-scope="scope">
          {{ scope.row.sentBytesCount }}
        </template>
      </el-table-column>
      <el-table-column label="发送的MQTT报文数量">
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
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getClientStates({
        startDate: '2020-12-18',
        endDate: '2020-12-19',
        sort: 'receivedPublishPacketsCount',
        direction: 'DESC',
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
    }
  }
}
</script>
