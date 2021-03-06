Ext.onReady(function(){

    function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    }

    var fm = Ext.form;


	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
		name : 'pagesize',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [[10, '10条/页'], [20, '20条/页'],
					[50, '50条/页'], [100, '100条/页'],
					[250, '250条/页'], [500, '500条/页']]
		}),
		valueField : 'value',
		displayField : 'text',
		value : '20',
		editable : false,
		width : 85
	});

	var number = parseInt(pagesize_combo.getValue());
	// 改变每页显示条数reload数据
	pagesize_combo.on("select", function(comboBox) {
		bbar.pageSize = parseInt(comboBox.getValue());
		number = parseInt(comboBox.getValue());
		store.reload({
			params : {
				start : 0,
				limit : bbar.pageSize
			}
		});
	});

	// 分页工具栏
	var bbar = new Ext.PagingToolbar({
		pageSize : number,
		store : store,
		displayInfo : true,
		displayMsg : '显示{0}条到{1}条,共{2}条',
		plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg : "没有符合条件的记录",
		items : ['-', '&nbsp;&nbsp;', pagesize_combo]
	});

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});
	// 定义列模型
	var cm = new Ext.grid.ColumnModel({
		defaults: {
            sortable: true // columns are not sortable by default           
        },
		columns: [rownum, 
		{
			header : 'Common Name', 
			width : 220,
			dataIndex : 'common'
		},
		{
			header : 'Light', 
			width : 130,
			dataIndex : 'light'
		},
		{
			header : 'Price', 
			width : 70,
			dataIndex : 'price'
		},
		{
			header : 'Available', 
			width : 95,
			dataIndex : 'availDate'
		}
	]});
	

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
					url : 'plants.xml'
				}),
		reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [{
						name : 'common'
					}])
	});
	
	// 表格实例
	var grid = new Ext.grid.GridPanel({
		title : '<span class="commoncss">Edit Plants</span>',
		width : 600,
		frame : true,
		autoScroll : true,
		renderTo : 'editor-grid',
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		//tbar : tbar, // 表格工具栏
		bbar : bbar,// 分页工具栏
		viewConfig : {
		// forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
});
