from flask import Flask, jsonify, request
from flask_cors import CORS
from pyecharts import options as opts
from pyecharts.charts import Map
from pyecharts.globals import ThemeType
import json

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 海南省地图数据（使用pyecharts内置的海南省地图）
def get_hainan_map_option():
    # 模拟各市企业数据
    city_data = [
        ("海口市", 4500, 1),  # 低风险
        ("三亚市", 2800, 1),
        ("儋州市", 1200, 2),  # 中风险
        ("琼海市", 800, 1),
        ("万宁市", 600, 1),
        ("东方市", 500, 3),  # 高风险
        ("澄迈县", 400, 1),
        ("临高县", 300, 2),
        ("白沙县", 200, 1),
        ("昌江县", 250, 2),
        ("乐东县", 350, 1),
        ("陵水县", 450, 1),
        ("保亭县", 150, 1),
        ("琼中县", 100, 1)
    ]
    
    # 根据风险等级设置颜色
    def get_color_by_risk(risk_level):
        if risk_level == 1:
            return "#67C23A"  # 低风险 - 绿色
        elif risk_level == 2:
            return "#E6A23C"  # 中风险 - 黄色
        else:
            return "#F56C6C"  # 高风险 - 红色
    
    # 创建地图 - 使用中国地图，只显示海南区域
    map_chart = (
        Map(init_opts=opts.InitOpts(
            theme=ThemeType.DARK,
            bg_color='rgba(255, 255, 255, 0.05)'
        ))
        .add(
            series_name="企业数量",
            data_pair=[("海南", 12000)],  # 使用海南作为整体数据
            maptype="china",
            is_map_symbol_show=False,
            label_opts=opts.LabelOpts(
                is_show=True,
                color="#fff",
                font_size=12
            ),
            itemstyle_opts=opts.ItemStyleOpts(
                border_color="#fff",
                border_width=1,
                area_color="rgba(255, 255, 255, 0.1)"
            ),
            emphasis_itemstyle_opts=opts.ItemStyleOpts(
                area_color="#ffd700",
                border_color="#ff6b35",
                border_width=2
            ),
            emphasis_label_opts=opts.LabelOpts(
                is_show=True,
                color="#fff",
                font_size=14,
                font_weight="bold"
            )
        )
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="海南省企业信用风险分布",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff")
            ),
            tooltip_opts=opts.TooltipOpts(
                trigger="item",
                background_color="rgba(0, 0, 0, 0.7)",
                border_color="#777",
                textstyle_opts=opts.TextStyleOpts(color="#fff"),
                formatter="{b}<br/>企业总数：{c}家"
            ),
            visualmap_opts=opts.VisualMapOpts(
                is_show=False  # 隐藏右侧图例
            )
        )
    )
    
    # 添加风险等级数据到tooltip
    option = map_chart.dump_options()
    
    # 简化逻辑：直接使用pyecharts生成的配置，不进行复杂的数据修改
    # 因为tooltip formatter已经在前面的配置中设置好了
    
    return option

@app.route('/api/map/hainan', methods=['GET'])
def get_hainan_map():
    """获取海南省地图配置"""
    try:
        option = get_hainan_map_option()
        return jsonify({
            "success": True,
            "data": option
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({"status": "healthy", "message": "Backend API is running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)