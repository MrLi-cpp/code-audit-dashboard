# 漏报清单 (False Negatives)

> 总计 530 条漏报

## Round 01 (3 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 01-UserMgmt-SA | 01-UserMgmt-SA/main.js | 3 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 用户管理系统 |
| 02-UserMgmt-SB | 02-UserMgmt-SB/main.js | 11 | endpoint_handler | 弱加密 | 中 | 弱加密 - 用户管理系统 |
| 03-UserMgmt-QA | 03-UserMgmt-QA/main.js | 11 | endpoint_handler | 并发安全问题 | 中 | 并发安全问题 - 用户管理系统 |

## Round 02 (2 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 06-BlogCMS-SB | 06-BlogCMS-SB/main.js | 11 | endpoint_handler | SQL注入 | 中 | SQL注入 - 博客CMS |
| 06-BlogCMS-SB | 06-BlogCMS-SB/routes.js | 13 | 全局 | SQL注入 | 高 | SQL注入 - 博客CMS |

## Round 03 (4 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 09-Ecommerce-SA | 09-Ecommerce-SA/main.js | 7 | 全局 | CSRF/CORS | 中 | CSRF/CORS - 电商订单 |
| 10-Ecommerce-SB | 10-Ecommerce-SB/main.js | 11 | endpoint_handler | XSS | 中 | XSS - 电商订单 |
| 10-Ecommerce-SB | 10-Ecommerce-SB/routes.js | 13 | 全局 | XSS | 低 | XSS - 电商订单 |
| 10-Ecommerce-SB | 10-Ecommerce-SB/controller.js | 7 | listOrders | XSS | 中 | XSS - 电商订单 |

## Round 04 (8 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 13-Payment-SA | 13-Payment-SA/main.js | 11 | endpoint_handler | JWT认证绕过 | 低 | JWT认证绕过 - 支付网关 |
| 13-Payment-SA | 13-Payment-SA/routes.js | 12 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 支付网关 |
| 13-Payment-SA | 13-Payment-SA/controller.js | 19 | listTransactions | JWT认证绕过 | 高 | JWT认证绕过 - 支付网关 |
| 13-Payment-SA | 13-Payment-SA/model.js | 31 | list | JWT认证绕过 | 中 | JWT认证绕过 - 支付网关 |
| 14-Payment-SB | 14-Payment-SB/main.js | 11 | endpoint_handler | 弱加密 | 低 | 弱加密 - 支付网关 |
| 14-Payment-SB | 14-Payment-SB/routes.js | 12 | 全局 | 弱加密 | 中 | 弱加密 - 支付网关 |
| 14-Payment-SB | 14-Payment-SB/controller.js | 19 | listTransactions | 弱加密 | 高 | 弱加密 - 支付网关 |
| 14-Payment-SB | 14-Payment-SB/model.js | 31 | list | 弱加密 | 中 | 弱加密 - 支付网关 |

## Round 05 (14 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 18-FileStorage-SB | 18-FileStorage-SB/main.js | 11 | endpoint_handler | 路径遍历 | 中 | 路径遍历 - 文件存储服务 |
| 18-FileStorage-SB | 18-FileStorage-SB/controller.js | 19 | listFiles | 路径遍历 | 高 | 路径遍历 - 文件存储服务 |
| 18-FileStorage-SB | 18-FileStorage-SB/model.js | 31 | list | 路径遍历 | 中 | 路径遍历 - 文件存储服务 |
| 18-FileStorage-SB | 18-FileStorage-SB/service.js | 23 | generateToken | 路径遍历 | 中 | 路径遍历 - 文件存储服务 |
| 17-FileStorage-SA | 17-FileStorage-SA/main.js | 11 | endpoint_handler | XSS | 中 | XSS - 文件存储服务 |
| 17-FileStorage-SA | 17-FileStorage-SA/routes.js | 12 | 全局 | XSS | 低 | XSS - 文件存储服务 |
| 17-FileStorage-SA | 17-FileStorage-SA/controller.js | 7 | listFiles | XSS | 高 | XSS - 文件存储服务 |
| 17-FileStorage-SA | 17-FileStorage-SA/model.js | 31 | list | XSS | 中 | XSS - 文件存储服务 |
| 17-FileStorage-SA | 17-FileStorage-SA/service.js | 23 | generateToken | XSS | 中 | XSS - 文件存储服务 |
| 19-FileStorage-QA | 19-FileStorage-QA/main.js | 11 | endpoint_handler | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 文件存储服务 |
| 19-FileStorage-QA | 19-FileStorage-QA/routes.js | 12 | 全局 | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 文件存储服务 |
| 19-FileStorage-QA | 19-FileStorage-QA/controller.js | 19 | listFiles | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 文件存储服务 |
| 19-FileStorage-QA | 19-FileStorage-QA/model.js | 31 | list | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 文件存储服务 |
| 19-FileStorage-QA | 19-FileStorage-QA/service.js | 23 | generateToken | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 文件存储服务 |

## Round 06 (24 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 21-IoT-SA | 21-IoT-SA/main.js | 11 | endpoint_handler | JWT认证绕过 | 高 | JWT认证绕过 - IoT数据采集 |
| 21-IoT-SA | 21-IoT-SA/routes.js | 12 | 全局 | JWT认证绕过 | 高 | JWT认证绕过 - IoT数据采集 |
| 21-IoT-SA | 21-IoT-SA/controller.js | 19 | getMetrics | JWT认证绕过 | 中 | JWT认证绕过 - IoT数据采集 |
| 21-IoT-SA | 21-IoT-SA/model.js | 31 | list | JWT认证绕过 | 中 | JWT认证绕过 - IoT数据采集 |
| 21-IoT-SA | 21-IoT-SA/service.js | 23 | generateToken | JWT认证绕过 | 中 | JWT认证绕过 - IoT数据采集 |
| 21-IoT-SA | 21-IoT-SA/main.js | 12 | endpoint_handler | JWT认证绕过 | 低 | JWT认证绕过 - IoT数据采集 |
| 22-IoT-SB | 22-IoT-SB/main.js | 11 | endpoint_handler | SSRF | 高 | SSRF - IoT数据采集 |
| 22-IoT-SB | 22-IoT-SB/routes.js | 12 | 全局 | SSRF | 高 | SSRF - IoT数据采集 |
| 22-IoT-SB | 22-IoT-SB/controller.js | 19 | getMetrics | SSRF | 中 | SSRF - IoT数据采集 |
| 22-IoT-SB | 22-IoT-SB/model.js | 31 | list | SSRF | 中 | SSRF - IoT数据采集 |
| 22-IoT-SB | 22-IoT-SB/service.js | 23 | generateToken | SSRF | 中 | SSRF - IoT数据采集 |
| 22-IoT-SB | 22-IoT-SB/main.js | 12 | endpoint_handler | SSRF | 低 | SSRF - IoT数据采集 |
| 23-IoT-QA | 23-IoT-QA/main.js | 11 | endpoint_handler | 并发安全问题 | 高 | 并发安全问题 - IoT数据采集 |
| 23-IoT-QA | 23-IoT-QA/routes.js | 12 | 全局 | 并发安全问题 | 高 | 并发安全问题 - IoT数据采集 |
| 23-IoT-QA | 23-IoT-QA/controller.js | 19 | getMetrics | 并发安全问题 | 中 | 并发安全问题 - IoT数据采集 |
| 23-IoT-QA | 23-IoT-QA/model.js | 31 | list | 并发安全问题 | 中 | 并发安全问题 - IoT数据采集 |
| 23-IoT-QA | 23-IoT-QA/service.js | 23 | generateToken | 并发安全问题 | 中 | 并发安全问题 - IoT数据采集 |
| 23-IoT-QA | 23-IoT-QA/main.js | 13 | endpoint_handler | 并发安全问题 | 低 | 并发安全问题 - IoT数据采集 |
| 24-IoT-QB | 24-IoT-QB/main.js | 11 | endpoint_handler | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - IoT数据采集 |
| 24-IoT-QB | 24-IoT-QB/routes.js | 12 | 全局 | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - IoT数据采集 |
| 24-IoT-QB | 24-IoT-QB/controller.js | 19 | getMetrics | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - IoT数据采集 |
| 24-IoT-QB | 24-IoT-QB/model.js | 31 | list | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - IoT数据采集 |
| 24-IoT-QB | 24-IoT-QB/service.js | 23 | generateToken | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - IoT数据采集 |
| 24-IoT-QB | 24-IoT-QB/main.js | 12 | endpoint_handler | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - IoT数据采集 |

## Round 07 (11 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 26-Chat-SB | 26-Chat-SB/main.js | 11 | endpoint_handler | JWT认证绕过 | 高 | JWT认证绕过 - 即时聊天 |
| 26-Chat-SB | 26-Chat-SB/routes.js | 12 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 即时聊天 |
| 26-Chat-SB | 26-Chat-SB/controller.js | 19 | createRoom | JWT认证绕过 | 中 | JWT认证绕过 - 即时聊天 |
| 26-Chat-SB | 26-Chat-SB/model.js | 31 | list | JWT认证绕过 | 高 | JWT认证绕过 - 即时聊天 |
| 26-Chat-SB | 26-Chat-SB/service.js | 23 | generateToken | JWT认证绕过 | 低 | JWT认证绕过 - 即时聊天 |
| 26-Chat-SB | 26-Chat-SB/main.js | 12 | endpoint_handler | JWT认证绕过 | 中 | JWT认证绕过 - 即时聊天 |
| 26-Chat-SB | 26-Chat-SB/routes.js | 13 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 即时聊天 |
| 27-Chat-QA | 27-Chat-QA/main.js | 11 | endpoint_handler | 圈复杂度过高 | 高 | 圈复杂度过高 - 即时聊天 |
| 27-Chat-QA | 27-Chat-QA/routes.js | 12 | 全局 | 圈复杂度过高 | 中 | 圈复杂度过高 - 即时聊天 |
| 27-Chat-QA | 27-Chat-QA/main.js | 22 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 即时聊天 |
| 27-Chat-QA | 27-Chat-QA/routes.js | 23 | 全局 | 圈复杂度过高 | 中 | 圈复杂度过高 - 即时聊天 |

## Round 08 (24 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 29-APIGateway-SA | 29-APIGateway-SA/main.js | 7 | 全局 | CSRF/CORS | 高 | CSRF/CORS - API网关 |
| 29-APIGateway-SA | 29-APIGateway-SA/main.js | 7 | 全局 | CSRF/CORS | 低 | CSRF/CORS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/main.js | 11 | endpoint_handler | XSS | 高 | XSS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/routes.js | 12 | 全局 | XSS | 中 | XSS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/controller.js | 7 | logRequest | XSS | 中 | XSS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/model.js | 31 | list | XSS | 中 | XSS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/service.js | 23 | generateToken | XSS | 高 | XSS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/main.js | 12 | endpoint_handler | XSS | 低 | XSS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/routes.js | 13 | 全局 | XSS | 低 | XSS - API网关 |
| 30-APIGateway-SB | 30-APIGateway-SB/controller.js | 8 | logRequest | XSS | 中 | XSS - API网关 |
| 31-APIGateway-QA | 31-APIGateway-QA/main.js | 11 | endpoint_handler | 圈复杂度过高 | 高 | 圈复杂度过高 - API网关 |
| 31-APIGateway-QA | 31-APIGateway-QA/routes.js | 12 | 全局 | 圈复杂度过高 | 中 | 圈复杂度过高 - API网关 |
| 31-APIGateway-QA | 31-APIGateway-QA/controller.js | 19 | logRequest | 圈复杂度过高 | 中 | 圈复杂度过高 - API网关 |
| 31-APIGateway-QA | 31-APIGateway-QA/main.js | 22 | complexLogic | 圈复杂度过高 | 低 | 圈复杂度过高 - API网关 |
| 31-APIGateway-QA | 31-APIGateway-QA/routes.js | 23 | 全局 | 圈复杂度过高 | 低 | 圈复杂度过高 - API网关 |
| 31-APIGateway-QA | 31-APIGateway-QA/controller.js | 30 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/main.js | 11 | endpoint_handler | 并发安全问题 | 高 | 并发安全问题 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/routes.js | 12 | 全局 | 并发安全问题 | 中 | 并发安全问题 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/controller.js | 19 | logRequest | 并发安全问题 | 中 | 并发安全问题 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/model.js | 31 | list | 并发安全问题 | 中 | 并发安全问题 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/service.js | 23 | generateToken | 并发安全问题 | 高 | 并发安全问题 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/main.js | 13 | endpoint_handler | 并发安全问题 | 低 | 并发安全问题 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/routes.js | 14 | 全局 | 并发安全问题 | 低 | 并发安全问题 - API网关 |
| 32-APIGateway-QB | 32-APIGateway-QB/controller.js | 21 | logRequest | 并发安全问题 | 中 | 并发安全问题 - API网关 |

## Round 09 (20 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/main.js | 11 | endpoint_handler | JWT认证绕过 | 低 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/routes.js | 13 | 全局 | JWT认证绕过 | 高 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/controller.js | 23 | executeTask | JWT认证绕过 | 中 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/model.js | 31 | list | JWT认证绕过 | 低 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/service.js | 23 | generateToken | JWT认证绕过 | 高 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/main.js | 12 | endpoint_handler | JWT认证绕过 | 中 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/routes.js | 14 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/controller.js | 24 | executeTask | JWT认证绕过 | 中 | JWT认证绕过 - 任务调度 |
| 33-TaskScheduler-SA | 33-TaskScheduler-SA/model.js | 32 | list | JWT认证绕过 | 中 | JWT认证绕过 - 任务调度 |
| 34-TaskScheduler-SB | 34-TaskScheduler-SB/main.js | 7 | 全局 | CSRF/CORS | 低 | CSRF/CORS - 任务调度 |
| 34-TaskScheduler-SB | 34-TaskScheduler-SB/main.js | 7 | 全局 | CSRF/CORS | 中 | CSRF/CORS - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/main.js | 11 | endpoint_handler | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/routes.js | 13 | 全局 | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/controller.js | 23 | executeTask | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/model.js | 31 | list | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/service.js | 23 | generateToken | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/main.js | 12 | endpoint_handler | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/routes.js | 14 | 全局 | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/controller.js | 24 | executeTask | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 任务调度 |
| 36-TaskScheduler-QB | 36-TaskScheduler-QB/model.js | 32 | list | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 任务调度 |

## Round 10 (39 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/main.js | 11 | endpoint_handler | 弱加密 | 中 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/routes.js | 12 | 全局 | 弱加密 | 高 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/controller.js | 19 | exportLogs | 弱加密 | 中 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/model.js | 31 | list | 弱加密 | 高 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/service.js | 19 | generateToken | 弱加密 | 低 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/main.js | 12 | endpoint_handler | 弱加密 | 低 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/routes.js | 13 | 全局 | 弱加密 | 中 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/controller.js | 20 | exportLogs | 弱加密 | 中 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/model.js | 32 | list | 弱加密 | 中 | 弱加密 - 日志分析 |
| 37-LogAnalysis-SA | 37-LogAnalysis-SA/service.js | 23 | generateToken | 弱加密 | 高 | 弱加密 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/main.js | 3 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/model.js | 2 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/service.js | 2 | 全局 | 硬编码密钥 | 低 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/main.js | 3 | 全局 | 硬编码密钥 | 低 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/routes.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/model.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 日志分析 |
| 38-LogAnalysis-SB | 38-LogAnalysis-SB/service.js | 2 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/main.js | 11 | endpoint_handler | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/routes.js | 12 | 全局 | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/controller.js | 19 | exportLogs | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/model.js | 31 | list | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/service.js | 23 | generateToken | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/main.js | 12 | endpoint_handler | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/routes.js | 13 | 全局 | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/controller.js | 20 | exportLogs | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/model.js | 32 | list | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 日志分析 |
| 39-LogAnalysis-QA | 39-LogAnalysis-QA/service.js | 24 | generateToken | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/main.js | 11 | endpoint_handler | 资源未释放 | 中 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/routes.js | 12 | 全局 | 资源未释放 | 高 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/controller.js | 19 | exportLogs | 资源未释放 | 中 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/model.js | 31 | list | 资源未释放 | 高 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/service.js | 23 | generateToken | 资源未释放 | 低 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/main.js | 12 | endpoint_handler | 资源未释放 | 低 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/routes.js | 13 | 全局 | 资源未释放 | 中 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/controller.js | 20 | exportLogs | 资源未释放 | 中 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/model.js | 32 | list | 资源未释放 | 中 | 资源未释放 - 日志分析 |
| 40-LogAnalysis-QB | 40-LogAnalysis-QB/service.js | 24 | generateToken | 资源未释放 | 高 | 资源未释放 - 日志分析 |

## Round 11 (33 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 41-DataViz-SA | 41-DataViz-SA/main.js | 11 | endpoint_handler | XSS | 高 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/routes.js | 12 | 全局 | XSS | 中 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/controller.js | 7 | deleteWidget | XSS | 低 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/model.js | 31 | list | XSS | 低 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/service.js | 23 | generateToken | XSS | 中 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/main.js | 12 | endpoint_handler | XSS | 高 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/routes.js | 13 | 全局 | XSS | 中 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/controller.js | 8 | deleteWidget | XSS | 中 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/model.js | 32 | list | XSS | 高 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/service.js | 24 | generateToken | XSS | 中 | XSS - 数据可视化 |
| 41-DataViz-SA | 41-DataViz-SA/main.js | 13 | endpoint_handler | XSS | 中 | XSS - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/main.js | 11 | endpoint_handler | SSRF | 高 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/routes.js | 12 | 全局 | SSRF | 中 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/controller.js | 19 | deleteWidget | SSRF | 低 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/model.js | 31 | list | SSRF | 低 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/service.js | 23 | generateToken | SSRF | 中 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/main.js | 12 | endpoint_handler | SSRF | 高 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/routes.js | 13 | 全局 | SSRF | 中 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/controller.js | 20 | deleteWidget | SSRF | 中 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/model.js | 32 | list | SSRF | 高 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/service.js | 24 | generateToken | SSRF | 中 | SSRF - 数据可视化 |
| 42-DataViz-SB | 42-DataViz-SB/main.js | 13 | endpoint_handler | SSRF | 中 | SSRF - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/main.js | 11 | endpoint_handler | 资源未释放 | 高 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/routes.js | 12 | 全局 | 资源未释放 | 中 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/controller.js | 19 | deleteWidget | 资源未释放 | 低 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/model.js | 31 | list | 资源未释放 | 低 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/service.js | 23 | generateToken | 资源未释放 | 中 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/main.js | 12 | endpoint_handler | 资源未释放 | 高 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/routes.js | 13 | 全局 | 资源未释放 | 中 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/controller.js | 20 | deleteWidget | 资源未释放 | 中 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/model.js | 32 | list | 资源未释放 | 高 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/service.js | 24 | generateToken | 资源未释放 | 中 | 资源未释放 - 数据可视化 |
| 43-DataViz-QA | 43-DataViz-QA/main.js | 13 | endpoint_handler | 资源未释放 | 中 | 资源未释放 - 数据可视化 |

## Round 12 (46 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 45-ShortLink-SA | 45-ShortLink-SA/main.js | 3 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/controller.js | 2 | 全局 | 硬编码密钥 | 低 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/model.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/service.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/utils.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/main.js | 3 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/routes.js | 2 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/model.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/service.js | 2 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 短链服务 |
| 45-ShortLink-SA | 45-ShortLink-SA/utils.js | 2 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/main.js | 11 | endpoint_handler | 路径遍历 | 高 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/routes.js | 12 | 全局 | 路径遍历 | 低 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/controller.js | 19 | deleteLink | 路径遍历 | 低 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/model.js | 31 | list | 路径遍历 | 中 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/service.js | 23 | generateToken | 路径遍历 | 中 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/utils.js | 20 | sleep | 路径遍历 | 中 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/main.js | 12 | endpoint_handler | 路径遍历 | 中 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/routes.js | 13 | 全局 | 路径遍历 | 高 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/model.js | 32 | list | 路径遍历 | 中 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/service.js | 24 | generateToken | 路径遍历 | 高 | 路径遍历 - 短链服务 |
| 46-ShortLink-SB | 46-ShortLink-SB/utils.js | 21 | sleep | 路径遍历 | 高 | 路径遍历 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/main.js | 11 | endpoint_handler | 资源未释放 | 高 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/routes.js | 12 | 全局 | 资源未释放 | 低 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/controller.js | 19 | deleteLink | 资源未释放 | 低 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/model.js | 31 | list | 资源未释放 | 中 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/service.js | 23 | generateToken | 资源未释放 | 中 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/utils.js | 20 | sleep | 资源未释放 | 中 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/main.js | 12 | endpoint_handler | 资源未释放 | 中 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/routes.js | 13 | 全局 | 资源未释放 | 高 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/controller.js | 20 | deleteLink | 资源未释放 | 中 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/model.js | 32 | list | 资源未释放 | 中 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/service.js | 24 | generateToken | 资源未释放 | 高 | 资源未释放 - 短链服务 |
| 47-ShortLink-QA | 47-ShortLink-QA/utils.js | 21 | sleep | 资源未释放 | 高 | 资源未释放 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/main.js | 11 | endpoint_handler | 空指针/边界 | 高 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/routes.js | 12 | 全局 | 空指针/边界 | 低 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/controller.js | 19 | deleteLink | 空指针/边界 | 低 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/model.js | 31 | list | 空指针/边界 | 中 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/service.js | 23 | generateToken | 空指针/边界 | 中 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/utils.js | 20 | sleep | 空指针/边界 | 中 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/main.js | 12 | endpoint_handler | 空指针/边界 | 中 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/routes.js | 13 | 全局 | 空指针/边界 | 高 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/controller.js | 20 | deleteLink | 空指针/边界 | 中 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/model.js | 32 | list | 空指针/边界 | 中 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/service.js | 24 | generateToken | 空指针/边界 | 高 | 空指针/边界 - 短链服务 |
| 48-ShortLink-QB | 48-ShortLink-QB/utils.js | 21 | sleep | 空指针/边界 | 高 | 空指针/边界 - 短链服务 |

## Round 13 (51 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 49-MailPush-SA | 49-MailPush-SA/main.js | 3 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/model.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/service.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/utils.js | 2 | 全局 | 硬编码密钥 | 低 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/main.js | 3 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/routes.js | 2 | 全局 | 硬编码密钥 | 低 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/model.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/service.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/utils.js | 2 | 全局 | 硬编码密钥 | 低 | 硬编码密钥 - 邮件推送 |
| 49-MailPush-SA | 49-MailPush-SA/main.js | 3 | 全局 | 硬编码密钥 | 高 | 硬编码密钥 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/main.js | 11 | endpoint_handler | SQL注入 | 高 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/routes.js | 12 | 全局 | SQL注入 | 高 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/controller.js | 19 | listTemplates | SQL注入 | 中 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/model.js | 31 | list | SQL注入 | 中 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/service.js | 23 | generateToken | SQL注入 | 中 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/utils.js | 20 | sleep | SQL注入 | 低 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/main.js | 12 | endpoint_handler | SQL注入 | 中 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/routes.js | 13 | 全局 | SQL注入 | 低 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/controller.js | 20 | listTemplates | SQL注入 | 中 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/model.js | 32 | list | SQL注入 | 中 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/service.js | 24 | generateToken | SQL注入 | 中 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/utils.js | 21 | sleep | SQL注入 | 低 | SQL注入 - 邮件推送 |
| 50-MailPush-SB | 50-MailPush-SB/main.js | 13 | endpoint_handler | SQL注入 | 高 | SQL注入 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/main.js | 11 | endpoint_handler | 圈复杂度过高 | 高 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/routes.js | 12 | 全局 | 圈复杂度过高 | 高 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/controller.js | 19 | listTemplates | 圈复杂度过高 | 中 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/model.js | 31 | list | 圈复杂度过高 | 中 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/service.js | 23 | generateToken | 圈复杂度过高 | 中 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/utils.js | 20 | sleep | 圈复杂度过高 | 低 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/main.js | 22 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/routes.js | 23 | 全局 | 圈复杂度过高 | 低 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/controller.js | 30 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/model.js | 42 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/service.js | 34 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/utils.js | 31 | complexLogic | 圈复杂度过高 | 低 | 圈复杂度过高 - 邮件推送 |
| 51-MailPush-QA | 51-MailPush-QA/main.js | 33 | complexLogic | 圈复杂度过高 | 高 | 圈复杂度过高 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/main.js | 11 | endpoint_handler | 资源未释放 | 高 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/routes.js | 12 | 全局 | 资源未释放 | 高 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/controller.js | 19 | listTemplates | 资源未释放 | 中 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/model.js | 31 | list | 资源未释放 | 中 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/service.js | 23 | generateToken | 资源未释放 | 中 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/utils.js | 20 | sleep | 资源未释放 | 低 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/main.js | 12 | endpoint_handler | 资源未释放 | 中 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/routes.js | 13 | 全局 | 资源未释放 | 低 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/controller.js | 20 | listTemplates | 资源未释放 | 中 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/model.js | 32 | list | 资源未释放 | 中 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/service.js | 24 | generateToken | 资源未释放 | 中 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/utils.js | 21 | sleep | 资源未释放 | 低 | 资源未释放 - 邮件推送 |
| 52-MailPush-QB | 52-MailPush-QB/main.js | 13 | endpoint_handler | 资源未释放 | 高 | 资源未释放 - 邮件推送 |

## Round 14 (16 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 53-Inventory-SA | 53-Inventory-SA/main.js | 7 | 全局 | CSRF/CORS | 中 | CSRF/CORS - 库存管理 |
| 53-Inventory-SA | 53-Inventory-SA/main.js | 7 | 全局 | CSRF/CORS | 中 | CSRF/CORS - 库存管理 |
| 53-Inventory-SA | 53-Inventory-SA/main.js | 7 | 全局 | CSRF/CORS | 高 | CSRF/CORS - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/main.js | 11 | endpoint_handler | 路径遍历 | 中 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/routes.js | 13 | 全局 | 路径遍历 | 低 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/controller.js | 23 | getHistory | 路径遍历 | 中 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/model.js | 31 | list | 路径遍历 | 高 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/service.js | 23 | generateToken | 路径遍历 | 中 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/utils.js | 20 | sleep | 路径遍历 | 低 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/main.js | 12 | endpoint_handler | 路径遍历 | 中 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/routes.js | 14 | 全局 | 路径遍历 | 中 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/model.js | 32 | list | 路径遍历 | 低 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/service.js | 24 | generateToken | 路径遍历 | 高 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/utils.js | 21 | sleep | 路径遍历 | 高 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/main.js | 13 | endpoint_handler | 路径遍历 | 高 | 路径遍历 - 库存管理 |
| 54-Inventory-SB | 54-Inventory-SB/routes.js | 15 | 全局 | 路径遍历 | 中 | 路径遍历 - 库存管理 |

## Round 15 (23 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 57-Comment-SA | 57-Comment-SA/main.js | 7 | 全局 | CSRF/CORS | 低 | CSRF/CORS - 评论系统 |
| 57-Comment-SA | 57-Comment-SA/main.js | 7 | 全局 | CSRF/CORS | 中 | CSRF/CORS - 评论系统 |
| 57-Comment-SA | 57-Comment-SA/main.js | 7 | 全局 | CSRF/CORS | 中 | CSRF/CORS - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/main.js | 11 | endpoint_handler | SSRF | 低 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/routes.js | 12 | 全局 | SSRF | 中 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/controller.js | 19 | moderateComment | SSRF | 中 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/model.js | 31 | list | SSRF | 高 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/service.js | 23 | generateToken | SSRF | 低 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/utils.js | 20 | sleep | SSRF | 高 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/main.js | 12 | endpoint_handler | SSRF | 中 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/routes.js | 13 | 全局 | SSRF | 高 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/controller.js | 20 | moderateComment | SSRF | 中 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/model.js | 32 | list | SSRF | 高 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/service.js | 24 | generateToken | SSRF | 中 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/utils.js | 21 | sleep | SSRF | 中 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/main.js | 13 | endpoint_handler | SSRF | 中 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/routes.js | 14 | 全局 | SSRF | 低 | SSRF - 评论系统 |
| 58-Comment-SB | 58-Comment-SB/controller.js | 20 | moderateComment | SSRF | 中 | SSRF - 评论系统 |
| 60-Comment-QB | 60-Comment-QB/main.js | 1 | 全局 | 死代码 | 中 | 死代码 - 评论系统 |
| 60-Comment-QB | 60-Comment-QB/routes.js | 1 | 全局 | 死代码 | 高 | 死代码 - 评论系统 |
| 60-Comment-QB | 60-Comment-QB/model.js | 1 | 全局 | 死代码 | 高 | 死代码 - 评论系统 |
| 60-Comment-QB | 60-Comment-QB/main.js | 1 | 全局 | 死代码 | 中 | 死代码 - 评论系统 |
| 60-Comment-QB | 60-Comment-QB/routes.js | 1 | 全局 | 死代码 | 低 | 死代码 - 评论系统 |

## Round 16 (51 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 61-Recommend-SA | 61-Recommend-SA/main.js | 11 | endpoint_handler | 弱加密 | 高 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/routes.js | 12 | 全局 | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/controller.js | 19 | getSimilar | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/model.js | 31 | list | 弱加密 | 低 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/service.js | 19 | generateToken | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/utils.js | 20 | sleep | 弱加密 | 低 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/main.js | 12 | endpoint_handler | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/routes.js | 13 | 全局 | 弱加密 | 高 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/controller.js | 20 | getSimilar | 弱加密 | 高 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/model.js | 32 | list | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/service.js | 23 | generateToken | 弱加密 | 高 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/utils.js | 21 | sleep | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/main.js | 13 | endpoint_handler | 弱加密 | 高 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/routes.js | 14 | 全局 | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/controller.js | 21 | getSimilar | 弱加密 | 低 | 弱加密 - 推荐引擎 |
| 61-Recommend-SA | 61-Recommend-SA/model.js | 33 | list | 弱加密 | 中 | 弱加密 - 推荐引擎 |
| 62-Recommend-SB | 62-Recommend-SB/main.js | 7 | 全局 | CSRF/CORS | 高 | CSRF/CORS - 推荐引擎 |
| 62-Recommend-SB | 62-Recommend-SB/main.js | 7 | 全局 | CSRF/CORS | 中 | CSRF/CORS - 推荐引擎 |
| 62-Recommend-SB | 62-Recommend-SB/main.js | 7 | 全局 | CSRF/CORS | 高 | CSRF/CORS - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/main.js | 11 | endpoint_handler | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/routes.js | 12 | 全局 | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/controller.js | 19 | getSimilar | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/model.js | 31 | list | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/service.js | 23 | generateToken | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/utils.js | 20 | sleep | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/main.js | 12 | endpoint_handler | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/routes.js | 13 | 全局 | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/controller.js | 20 | getSimilar | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/model.js | 32 | list | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/service.js | 24 | generateToken | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/utils.js | 21 | sleep | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/main.js | 13 | endpoint_handler | 日志敏感信息泄露 | 高 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/routes.js | 14 | 全局 | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/controller.js | 21 | getSimilar | 日志敏感信息泄露 | 低 | 日志敏感信息泄露 - 推荐引擎 |
| 63-Recommend-QA | 63-Recommend-QA/model.js | 33 | list | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/main.js | 11 | endpoint_handler | 圈复杂度过高 | 高 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/routes.js | 12 | 全局 | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/controller.js | 19 | getSimilar | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/model.js | 31 | list | 圈复杂度过高 | 低 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/service.js | 23 | generateToken | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/utils.js | 20 | sleep | 圈复杂度过高 | 低 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/main.js | 22 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/routes.js | 23 | 全局 | 圈复杂度过高 | 高 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/controller.js | 30 | complexLogic | 圈复杂度过高 | 高 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/model.js | 42 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/service.js | 34 | complexLogic | 圈复杂度过高 | 高 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/utils.js | 31 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/main.js | 33 | complexLogic | 圈复杂度过高 | 高 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/routes.js | 34 | 全局 | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/controller.js | 41 | complexLogic | 圈复杂度过高 | 低 | 圈复杂度过高 - 推荐引擎 |
| 64-Recommend-QB | 64-Recommend-QB/model.js | 53 | complexLogic | 圈复杂度过高 | 中 | 圈复杂度过高 - 推荐引擎 |

## Round 17 (23 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 65-RBAC-SA | 65-RBAC-SA/main.js | 11 | endpoint_handler | XSS | 高 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/routes.js | 13 | 全局 | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/controller.js | 7 | listPermissions | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/model.js | 31 | list | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/service.js | 23 | generateToken | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/utils.js | 20 | sleep | XSS | 高 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/main.js | 12 | endpoint_handler | XSS | 高 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/routes.js | 14 | 全局 | XSS | 高 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/controller.js | 8 | listPermissions | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/model.js | 32 | list | XSS | 高 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/service.js | 24 | generateToken | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/utils.js | 21 | sleep | XSS | 低 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/main.js | 13 | endpoint_handler | XSS | 低 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/routes.js | 15 | 全局 | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/controller.js | 9 | listPermissions | XSS | 中 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/model.js | 33 | list | XSS | 低 | XSS - RBAC权限中心 |
| 65-RBAC-SA | 65-RBAC-SA/service.js | 25 | generateToken | XSS | 中 | XSS - RBAC权限中心 |
| 67-RBAC-QA | 67-RBAC-QA/main.js | 1 | 全局 | 死代码 | 高 | 死代码 - RBAC权限中心 |
| 67-RBAC-QA | 67-RBAC-QA/routes.js | 1 | 全局 | 死代码 | 高 | 死代码 - RBAC权限中心 |
| 67-RBAC-QA | 67-RBAC-QA/model.js | 1 | 全局 | 死代码 | 高 | 死代码 - RBAC权限中心 |
| 67-RBAC-QA | 67-RBAC-QA/main.js | 1 | 全局 | 死代码 | 低 | 死代码 - RBAC权限中心 |
| 67-RBAC-QA | 67-RBAC-QA/routes.js | 1 | 全局 | 死代码 | 中 | 死代码 - RBAC权限中心 |
| 67-RBAC-QA | 67-RBAC-QA/model.js | 1 | 全局 | 死代码 | 低 | 死代码 - RBAC权限中心 |

## Round 18 (36 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/main.js | 11 | endpoint_handler | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/routes.js | 12 | 全局 | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/controller.js | 19 | unsubscribe | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/model.js | 31 | list | SQL注入 | 高 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/service.js | 23 | generateToken | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/utils.js | 20 | sleep | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/main.js | 12 | endpoint_handler | SQL注入 | 低 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/routes.js | 13 | 全局 | SQL注入 | 低 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/controller.js | 20 | unsubscribe | SQL注入 | 高 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/model.js | 32 | list | SQL注入 | 高 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/service.js | 24 | generateToken | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/utils.js | 21 | sleep | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/main.js | 13 | endpoint_handler | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/routes.js | 14 | 全局 | SQL注入 | 低 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/controller.js | 21 | unsubscribe | SQL注入 | 高 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/model.js | 33 | list | SQL注入 | 中 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/service.js | 25 | generateToken | SQL注入 | 低 | SQL注入 - 实时通知 |
| 70-RealtimeNotify-SB | 70-RealtimeNotify-SB/utils.js | 22 | sleep | SQL注入 | 高 | SQL注入 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/main.js | 11 | endpoint_handler | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/routes.js | 10 | 全局 | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/controller.js | 19 | unsubscribe | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/model.js | 31 | list | API设计违规 | 高 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/service.js | 23 | generateToken | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/utils.js | 20 | sleep | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/main.js | 12 | endpoint_handler | API设计违规 | 低 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/routes.js | 10 | 全局 | API设计违规 | 低 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/controller.js | 20 | unsubscribe | API设计违规 | 高 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/model.js | 32 | list | API设计违规 | 高 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/service.js | 24 | generateToken | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/utils.js | 21 | sleep | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/main.js | 13 | endpoint_handler | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/routes.js | 10 | 全局 | API设计违规 | 低 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/controller.js | 21 | unsubscribe | API设计违规 | 高 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/model.js | 33 | list | API设计违规 | 中 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/service.js | 25 | generateToken | API设计违规 | 低 | API设计违规 - 实时通知 |
| 71-RealtimeNotify-QA | 71-RealtimeNotify-QA/utils.js | 22 | sleep | API设计违规 | 高 | API设计违规 - 实时通知 |

## Round 19 (44 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 73-Crawler-SA | 73-Crawler-SA/main.js | 11 | endpoint_handler | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/routes.js | 13 | 全局 | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/controller.js | 7 | listJobs | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/model.js | 31 | list | XSS | 低 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/service.js | 23 | generateToken | XSS | 高 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/utils.js | 20 | sleep | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/main.js | 12 | endpoint_handler | XSS | 低 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/routes.js | 14 | 全局 | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/controller.js | 8 | listJobs | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/model.js | 32 | list | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/service.js | 24 | generateToken | XSS | 低 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/utils.js | 21 | sleep | XSS | 高 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/main.js | 13 | endpoint_handler | XSS | 高 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/routes.js | 15 | 全局 | XSS | 低 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/controller.js | 9 | listJobs | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/model.js | 33 | list | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/service.js | 25 | generateToken | XSS | 高 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/utils.js | 22 | sleep | XSS | 中 | XSS - 爬虫调度 |
| 73-Crawler-SA | 73-Crawler-SA/main.js | 14 | endpoint_handler | XSS | 高 | XSS - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/main.js | 11 | endpoint_handler | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/routes.js | 13 | 全局 | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/controller.js | 23 | listJobs | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/model.js | 31 | list | 路径遍历 | 低 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/service.js | 23 | generateToken | 路径遍历 | 高 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/utils.js | 20 | sleep | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/main.js | 12 | endpoint_handler | 路径遍历 | 低 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/routes.js | 14 | 全局 | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/model.js | 32 | list | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/service.js | 24 | generateToken | 路径遍历 | 低 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/utils.js | 21 | sleep | 路径遍历 | 高 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/main.js | 13 | endpoint_handler | 路径遍历 | 高 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/routes.js | 15 | 全局 | 路径遍历 | 低 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/controller.js | 24 | listJobs | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/model.js | 33 | list | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/service.js | 25 | generateToken | 路径遍历 | 高 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/utils.js | 22 | sleep | 路径遍历 | 中 | 路径遍历 - 爬虫调度 |
| 74-Crawler-SB | 74-Crawler-SB/main.js | 14 | endpoint_handler | 路径遍历 | 高 | 路径遍历 - 爬虫调度 |
| 75-Crawler-QA | 75-Crawler-QA/main.js | 1 | 全局 | 死代码 | 低 | 死代码 - 爬虫调度 |
| 75-Crawler-QA | 75-Crawler-QA/routes.js | 1 | 全局 | 死代码 | 中 | 死代码 - 爬虫调度 |
| 75-Crawler-QA | 75-Crawler-QA/model.js | 1 | 全局 | 死代码 | 中 | 死代码 - 爬虫调度 |
| 75-Crawler-QA | 75-Crawler-QA/main.js | 1 | 全局 | 死代码 | 高 | 死代码 - 爬虫调度 |
| 75-Crawler-QA | 75-Crawler-QA/routes.js | 1 | 全局 | 死代码 | 低 | 死代码 - 爬虫调度 |
| 75-Crawler-QA | 75-Crawler-QA/model.js | 1 | 全局 | 死代码 | 中 | 死代码 - 爬虫调度 |
| 75-Crawler-QA | 75-Crawler-QA/main.js | 1 | 全局 | 死代码 | 高 | 死代码 - 爬虫调度 |

## Round 20 (58 条)

| 测试文件夹 | 文件路径 | 行号 | 函数 | 错误类型 | 隐蔽度 | 描述 |
|-----------|---------|------|------|----------|--------|------|
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/main.js | 11 | endpoint_handler | SQL注入 | 低 | SQL注入 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/routes.js | 13 | 全局 | XSS | 高 | XSS - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/service.js | 23 | generateToken | 路径遍历 | 低 | 路径遍历 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/main.js | 12 | endpoint_handler | 弱加密 | 中 | 弱加密 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/routes.js | 14 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/controller.js | 24 | validateConfig | SSRF | 高 | SSRF - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/service.js | 24 | generateToken | 重复代码 | 高 | 重复代码 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/utils.js | 21 | sleep | 魔法数字 | 高 | 魔法数字 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/main.js | 13 | endpoint_handler | 异常吞没 | 中 | 异常吞没 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/routes.js | 15 | 全局 | 资源未释放 | 低 | 资源未释放 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/controller.js | 1 | 全局 | 死代码 | 中 | 死代码 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/model.js | 33 | list | API设计违规 | 高 | API设计违规 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/service.js | 26 | generateToken | 圈复杂度过高 | 中 | 圈复杂度过高 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/utils.js | 24 | sleep | 并发安全问题 | 中 | 并发安全问题 - 配置中心 |
| 77-ConfigCenter-SA | 77-ConfigCenter-SA/main.js | 19 | 全局 | 空指针/边界 | 中 | 空指针/边界 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/main.js | 11 | endpoint_handler | SQL注入 | 低 | SQL注入 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/routes.js | 13 | 全局 | XSS | 高 | XSS - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/service.js | 23 | generateToken | 路径遍历 | 低 | 路径遍历 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/main.js | 12 | endpoint_handler | 弱加密 | 中 | 弱加密 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/routes.js | 14 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/controller.js | 24 | validateConfig | SSRF | 高 | SSRF - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/service.js | 24 | generateToken | 重复代码 | 高 | 重复代码 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/utils.js | 21 | sleep | 魔法数字 | 高 | 魔法数字 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/main.js | 13 | endpoint_handler | 异常吞没 | 中 | 异常吞没 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/routes.js | 15 | 全局 | 资源未释放 | 低 | 资源未释放 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/controller.js | 1 | 全局 | 死代码 | 中 | 死代码 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/model.js | 33 | list | API设计违规 | 高 | API设计违规 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/service.js | 26 | generateToken | 圈复杂度过高 | 中 | 圈复杂度过高 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/utils.js | 24 | sleep | 并发安全问题 | 中 | 并发安全问题 - 配置中心 |
| 78-ConfigCenter-SB | 78-ConfigCenter-SB/main.js | 19 | 全局 | 空指针/边界 | 中 | 空指针/边界 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/main.js | 11 | endpoint_handler | SQL注入 | 低 | SQL注入 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/routes.js | 13 | 全局 | XSS | 高 | XSS - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/model.js | 31 | list | 不安全的反序列化 | 中 | 不安全的反序列化 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/service.js | 23 | generateToken | 路径遍历 | 低 | 路径遍历 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/utils.js | 20 | sleep | 命令注入 | 高 | 命令注入 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/routes.js | 14 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/model.js | 32 | list | CSRF/CORS | 低 | CSRF/CORS - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/main.js | 13 | endpoint_handler | 异常吞没 | 中 | 异常吞没 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/model.js | 33 | list | API设计违规 | 高 | API设计违规 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/utils.js | 24 | sleep | 并发安全问题 | 中 | 并发安全问题 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/main.js | 19 | 全局 | 空指针/边界 | 中 | 空指针/边界 - 配置中心 |
| 79-ConfigCenter-QA | 79-ConfigCenter-QA/routes.js | 16 | 全局 | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/main.js | 11 | endpoint_handler | SQL注入 | 低 | SQL注入 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/routes.js | 13 | 全局 | XSS | 高 | XSS - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/controller.js | 2 | 全局 | 硬编码密钥 | 中 | 硬编码密钥 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/model.js | 31 | list | 不安全的反序列化 | 中 | 不安全的反序列化 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/service.js | 23 | generateToken | 路径遍历 | 低 | 路径遍历 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/utils.js | 20 | sleep | 命令注入 | 高 | 命令注入 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/routes.js | 14 | 全局 | JWT认证绕过 | 中 | JWT认证绕过 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/model.js | 32 | list | CSRF/CORS | 低 | CSRF/CORS - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/main.js | 13 | endpoint_handler | 异常吞没 | 中 | 异常吞没 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/model.js | 33 | list | API设计违规 | 高 | API设计违规 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/utils.js | 24 | sleep | 并发安全问题 | 中 | 并发安全问题 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/main.js | 19 | 全局 | 空指针/边界 | 中 | 空指针/边界 - 配置中心 |
| 80-ConfigCenter-QB | 80-ConfigCenter-QB/routes.js | 16 | 全局 | 日志敏感信息泄露 | 中 | 日志敏感信息泄露 - 配置中心 |

