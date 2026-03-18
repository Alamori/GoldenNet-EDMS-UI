import { motion } from "framer-motion";
import { Check, X, Clock, FileText, AlertTriangle } from "lucide-react";
import { useTasks, useProcessTask } from "@/hooks/use-tasks";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Workflow() {
  const { data: tasks, isLoading } = useTasks();
  const { mutate: processTask, isPending } = useProcessTask();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">سير العمل - مهامي المعلقة</h1>
          <p className="text-muted-foreground">الوثائق التي تتطلب مراجعتك أو موافقتك</p>
        </div>
        <div className="bg-warning/10 text-warning px-4 py-2 rounded-lg flex items-center gap-2 font-bold border border-warning/20 shadow-sm">
          <AlertTriangle size={20} />
          <span>{tasks?.length || 0} مهام تتطلب إجراء</span>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {isLoading ? (
          [1,2].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-pulse h-48"></div>
          ))
        ) : tasks?.length === 0 ? (
          <div className="bg-card rounded-3xl p-12 text-center border border-border shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">صندوق المهام فارغ</h3>
            <p className="text-muted-foreground">لقد أنجزت جميع مهامك، عمل رائع!</p>
          </div>
        ) : (
          tasks?.map((task) => (
            <motion.div 
              key={task.id}
              variants={itemVariants}
              className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              {/* Deadline Indicator */}
              <div className={`absolute top-0 left-0 px-6 py-2 rounded-br-2xl font-bold text-sm flex items-center gap-2 ${
                task.daysRemaining === 0 ? 'bg-danger text-white' : 
                task.daysRemaining <= 2 ? 'bg-warning text-white' : 'bg-primary/10 text-primary'
              }`}>
                <Clock size={16} />
                {task.daysRemaining === 0 ? "مستحق اليوم!" : `متبقي ${task.daysRemaining} أيام`}
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Info Section */}
                <div className="flex-1 space-y-4 pt-8 md:pt-0">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-foreground">{task.documentTitle}</h3>
                        <Badge variant="outline">{task.documentType}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">تاريخ الاستحقاق: <span className="font-semibold">{task.dueDate}</span></p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => processTask({ id: task.id, action: "approve" })}
                      disabled={isPending}
                      className="flex-1 bg-success hover:bg-success/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-success/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                    >
                      <Check size={20} /> موافقة واعتماد
                    </button>
                    <button 
                      onClick={() => processTask({ id: task.id, action: "reject" })}
                      disabled={isPending}
                      className="flex-1 bg-white border-2 border-danger text-danger hover:bg-danger hover:text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
                    >
                      <X size={20} className="group-hover:scale-110 transition-transform" /> إرجاع / رفض
                    </button>
                  </div>
                </div>

                {/* Workflow Stages */}
                <div className="w-full md:w-1/3 bg-gray-50/50 rounded-2xl p-6 border border-border">
                  <h4 className="font-bold mb-4 text-sm text-muted-foreground uppercase tracking-wider">مسار الاعتماد</h4>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {task.stages.map((stage, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-center">
                        <div className="hidden md:flex w-full justify-end pr-4">
                          {/* Empty side for centering on desktop */}
                        </div>
                        
                        <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-4 border-card shrink-0 shadow-sm ${
                          stage.status === 'completed' ? 'bg-success text-white' :
                          stage.status === 'pending' ? 'bg-warning text-white animate-pulse' :
                          'bg-gray-200 text-transparent'
                        }`}>
                          {stage.status === 'completed' && <Check size={14} strokeWidth={4} />}
                          {stage.status === 'pending' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>

                        <div className="w-full pl-4 md:pl-0 md:pr-4 flex md:justify-start">
                          <span className={`font-bold text-sm ${
                            stage.status === 'completed' ? 'text-success' :
                            stage.status === 'pending' ? 'text-warning' : 'text-muted-foreground'
                          }`}>
                            {stage.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
