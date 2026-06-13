# Output And Verify

输出前必须说明：

1. 审计后决定复用哪些功能资产。
2. 哪些组件只复用功能但重做视觉。
3. 哪些页面区域新写。
4. 是否调整 styles 或 tokens。
5. 如何避免 mock 数据。
6. 如何避免工程穿帮文案。

代码要求：

- React + TypeScript。
- 不新增依赖。
- 不创建 mock/fixture/data 文件。
- 不修改 API 类型。
- 不修改后端契约。
- 保持响应式。
- 保持可访问性。
- 应通过 `npm run verify`。

验证命令：

```bash
cd front
npm run verify
```
